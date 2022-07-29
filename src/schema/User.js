const { TC, User } = require('../models/User');

const {
    ValidationError,
    AuthenticationError,
    UserInputError,
} = require('apollo-server');
const {
    getToken,
    encryptPassword,
    requireAuth,
    authMiddleware,
    comparePassword,
} = require('../utils/auth');
const { deleteResolver } = require('../utils/deleteResolver');
const { v4: uuidv4 } = require('uuid');

const { CurrentUserTC } = require('../types/User/CurrentUser');

const { resetPassword } = require('../functions/User/passwordFunctions');
const { PasswordReset } = require('../models/PasswordReset');
const {
    activateUser,
    deactivateUser,
} = require('../functions/User/activateFunctions');
const {
    changeEmail,
    confirmEmailChangeCode,
} = require('../functions/User/changeEmail');
const {
    changePassword,
    confirmPasswordChangeCode,
} = require('../functions/User/changePassword');

TC.removeField('password');

const Input = TC.mongooseResolvers.createOne();
const EditInput = TC.mongooseResolvers.updateOne();

TC.addResolver({
    name: 'currentUser',
    type: CurrentUserTC,
    resolve: async ({ source, args, context }) => {
        const user = await User.findOne({ _id: context.user._id });
        try {
            return {
                user: user,
                permissions: context.permissions,
            };
        } catch (err) {
            throw new Error(err);
        }
    },
});

const Query = {
    currentUser: TC.getResolver('currentUser').withMiddlewares([
        authMiddleware,
    ]),
    getUser: TC.mongooseResolvers.findOne().withMiddlewares([authMiddleware]),
    listUsers: TC.mongooseResolvers
        .findMany()
        .addFilterArg({
            name: 'search',
            type: 'String',
            query: (query, value) => {
                if (value) {
                    query.$text = { $search: value };
                }
            },
        })
        .withMiddlewares([authMiddleware]),
};

const Mutation = {
    passwordCheck: {
        type: `type PasswordCheck {
            hasPassword: Boolean,
            email: String
        }`,
        args: { email: 'String!' },
        resolve: async (source, args, context, info) => {
            const user = await User.findOne({ email: args.email }).exec();
            if (!user) {
                throw new AuthenticationError(
                    'No user found with this email address.'
                );
            }

            if (!user.password) {
                const token = uuidv4();
                await User.findOneAndUpdate(
                    { email: args.email },
                    {
                        $set: { reset_token: token },
                    },
                    { new: true }
                );
                context.mail.sendEmailWithTemplate({
                    From: process.env.EMAIL_FROM,
                    To: user.email,
                    TemplateId: '26373932',
                    TemplateModel: {
                        link: `${process.env.URL}/complete-registration?token=${token}`,
                    },
                });
                return {
                    hasPassword: false,
                    email: user.email,
                };
            } else {
                return {
                    hasPassword: true,
                    email: user.email,
                };
            }
        },
    },
    login: {
        type: TC,
        args: { email: 'String!', password: 'String!' },
        resolve: async (source, args, context, info) => {
            // If the user doesn't have a password, make them set one.
            const user = await User.findOne({ email: args.email }).lean();
            if (!user) {
                throw new AuthenticationError(
                    'No user found with this email address.'
                );
            }

            if (!user.is_active) {
                throw new AuthenticationError(
                    'Your account has been suspended.  Please contact us to reinstate your account.'
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
                    throw new UserInputError('Wrong Password!');
                }
            } catch (err) {
                throw new ValidationError(err);
            }
        },
    },
    createUser: {
        type: TC,
        args: Input.getArgs(),
        resolve: async (source, args, context, info) => {
            // await requireAuth(context.user);

            const newUser = {
                ...args.record,
                password: args.record.password
                    ? await encryptPassword(args.record.password)
                    : null,
            };
            // Get user document from 'user' collection.
            const user = await User.findOne({ email: args.record.email });
            // Check If User Exists Already Throw Error
            if (user) {
                throw new UserInputError(
                    'A user already exists with this email address'
                );
            }

            try {
                const regUser = await User.create(newUser);
                const token = getToken(regUser);

                await context.mail.sendEmailWithTemplate({
                    From: process.env.EMAIL_FROM,
                    To: args.record.email,
                    TemplateId: '27149628',
                    TemplateModel: {
                        name: `${args.record.first_name}`,
                    },
                });

                return { ...regUser.toObject(), token };
            } catch (e) {
                throw e;
            }
        },
    },
    editUser: {
        type: TC,
        args: EditInput.getArgs(),

        resolve: async (parent, args, context, info) => {
            console.log(args);
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
                const user = await User.findOneAndUpdate(
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
    deleteUsers: deleteResolver(TC, User),
    forgotPassword: {
        type: TC,
        args: {
            email: 'String',
        },
        resolve: async (parent, args, context, info) => {
            const token = uuidv4();
            const user = await User.findOne({ email: args.email });
            // Check If User Exists Already Throw Error
            if (!user) {
                throw new ValidationError(
                    'No user found with this email address'
                );
            } else {
                const code = Math.floor(100000 + Math.random() * 900000);
                await PasswordReset.deleteMany({ user_id: user._id });
                await PasswordReset.create({
                    user_id: user._id,
                    code: code,
                });

                await context.mail.sendEmailWithTemplate({
                    From: process.env.EMAIL_FROM,
                    To: args.email,
                    TemplateId: '27150297',
                    TemplateModel: {
                        code: `${code}`,
                    },
                });

                return user;
            }
        },
    },
    resetPassword: resetPassword,
    verifyCode: {
        type: `type CodeResponse { success: Boolean, code: String }`,
        args: {
            code: 'String',
        },
        resolve: async (parent, args) => {
            try {
                const code = await PasswordReset.findOne({
                    code: args.code,
                }).exec();
                if (!code) {
                    throw new ValidationError('Code is invalid');
                }

                return { success: true, code: args.code };
            } catch {
                throw new Error('Error verifying code');
            }
        },
    },
    activateUser: activateUser,
    deactivateUser: deactivateUser,
    changeEmail: changeEmail,
    confirmEmailChangeCode: confirmEmailChangeCode,
    changePassword: changePassword,
    confirmPasswordChangeCode: confirmPasswordChangeCode,
};

module.exports = { Query, Mutation };
