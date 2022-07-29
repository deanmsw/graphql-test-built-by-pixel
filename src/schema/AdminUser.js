const { AdminUserTC, AdminUser } = require('../models/AdminUser');

const { ValidationError, AuthenticationError } = require('apollo-server');
const {
    getToken,
    encryptPassword,
    requireAuth,
    authMiddleware,
    comparePassword,
} = require('../utils/auth');
const { deleteResolver } = require('../utils/deleteResolver');
const { v4: uuidv4 } = require('uuid');
const { AdminCurrentUserTC } = require('../types/AdminUser/CurrentAdminUser');

AdminUserTC.removeField('password');

const Input = AdminUserTC.mongooseResolvers.createOne();
const EditInput = AdminUserTC.mongooseResolvers.updateOne();

AdminUserTC.addResolver({
    name: 'currentUser',
    type: AdminCurrentUserTC,
    resolve: async ({ context }) => {
        try {
            const res = await AdminUser.findOne({ _id: context.user._id })
                .populate('permission_role')
                .populate({
                    path: 'permission_role.permissions',
                    model: 'Permission',
                });
            console.log(res);

            return {
                user: res,
                permissions: context.permissions,
                admin: true,
            };
        } catch (err) {
            throw new Error(err);
        }
    },
});

const Query = {
    currentAdminUser: AdminUserTC.getResolver('currentUser').withMiddlewares([
        authMiddleware,
    ]),
    getAdminUser: AdminUserTC.mongooseResolvers
        .findOne()
        .withMiddlewares([authMiddleware]),
    listAdminUsers: AdminUserTC.mongooseResolvers
        .findMany()
        .withMiddlewares([authMiddleware]),
};

const Mutation = {
    adminLogin: {
        type: AdminUserTC,
        args: { email: 'String!', password: 'String!' },
        resolve: async (source, args, context, info) => {
            // If the user doesn't have a password, make them set one.
            const user = await AdminUser.findOne({ email: args.email }).lean();
            if (!user) {
                throw new AuthenticationError(
                    'No user found with this email address.'
                );
            }

            try {
                const isMatch = await comparePassword(
                    args.password,
                    user.password
                );

                if (isMatch) {
                    // Creating a Token from User Payload obtained.
                    const token = getToken(user);
                    return { ...user, token };
                } else {
                    // Throwing Error on Match Status Failed.
                    throw new AuthenticationError('Wrong Password!');
                }
            } catch (err) {
                throw new ValidationError(err);
            }
        },
    },
    createAdminUser: {
        type: AdminUserTC,
        args: Input.getArgs(),
        resolve: async (source, args, context, info) => {
            //await requireAuth(context.user);

            const newUser = {
                ...args.record,
                password: args.record.password
                    ? await encryptPassword(args.record.password)
                    : null,
            };
            // Get user document from 'user' collection.
            const user = await AdminUser.findOne({ email: args.record.email });
            // Check If User Exists Already Throw Error
            if (user) {
                throw new ValidationError(
                    'A user already exists with this email address'
                );
            }

            try {
                const regUser = await AdminUser.create(newUser);

                return regUser.toObject();
            } catch (e) {
                throw e;
            }
        },
    },
    editAdminUser: {
        type: AdminUserTC,
        args: EditInput.getArgs(),

        resolve: async (parent, args, context, info) => {
            await requireAuth(context.user);
            const password = args.record.password
                ? await encryptPassword(args.record.password)
                : null;
            let updatedDoc;
            if (password) {
                updatedDoc = {
                    $set: {
                        ...args.record,
                        password: await encryptPassword(args.record.password),
                    },
                };
            } else {
                updatedDoc = {
                    $set: args.record,
                };
            }
            const options = {
                upsert: false,
                returnOriginal: false,
                useFindAndModify: false,
            };
            try {
                const user = await AdminUser.findOneAndUpdate(
                    { _id: args.filter._id },
                    updatedDoc,
                    options
                );
                return user.toObject();
            } catch (e) {
                throw e;
            }
        },
    },
    deleteAdminUsers: deleteResolver(AdminUserTC, AdminUser),
    forgotAdminPassword: {
        type: AdminUserTC,
        args: {
            email: 'String',
        },
        resolve: async (parent, args, context, info) => {
            const token = uuidv4();
            const user = await AdminUser.findOne({ email: args.email });
            // Check If User Exists Already Throw Error
            if (!user) {
                throw new ValidationError(
                    'No user found with this email address'
                );
            } else {
                const user = await AdminUser.findOneAndUpdate(
                    { email: args.email },
                    {
                        $set: { reset_token: token },
                    },
                    { new: true }
                );
                context.mail.sendEmail({
                    From: '<noreply@builtbypixel.com> AskTask CMS',
                    To: args.email,
                    Subject: 'Reset your password',
                    HtmlBody: `<p>You have received this email because you have forgotten your password.<br /><br />
                    
                    To reset your password, please click the link below.<br /><br />
                    
                    <a href="${process.env.NUCLEUS_URL}/reset-password?token=${token}">Reset your password</a></p>
                    `,
                });

                return user;
            }
        },
    },
    resetAdminPassword: {
        type: AdminUserTC,
        args: {
            token: 'String',
            password: 'String',
        },
        resolve: async (parent, args, context, info) => {
            const user = await AdminUser.findOne({ reset_token: args.token });
            // Check If User Exists Already Throw Error
            if (!user) {
                throw new ValidationError('The token provided is invalid');
            } else {
                await AdminUser.findOneAndUpdate(
                    { reset_token: args.token },
                    {
                        $set: {
                            password: await encryptPassword(args.password),
                        },
                        $unset: {
                            reset_token: '',
                        },
                    },
                    { new: true }
                );

                return user.toObject();
            }
        },
    },
    verifyAdminToken: {
        type: AdminUserTC,
        args: {
            token: 'String',
        },
        resolve: async (parent, args) => {
            try {
                const user = await AdminUser.findOne({
                    token: args.token,
                }).exec();
                if (!user) {
                    throw new ValidationError('Token is invalid');
                }
                await AdminUser.findOneAndUpdate(
                    { token: args.token },
                    {
                        $unset: {
                            token: null,
                        },
                    }
                ).populate('permission_role');
                const usr = user.toObject();

                const token = getToken(usr);
                return { ...usr, token };
            } catch {
                throw new Error('Error verifying token');
            }
        },
    },
};

module.exports = { Query, Mutation };
