import { EmailChange } from '../../models/EmailChanges';
import { PasswordReset } from '../../models/PasswordReset';
import { TC, User } from '../../models/User';
import { encryptPassword } from '../../utils/auth';

const { AuthenticationError, ValidationError } = require('apollo-server');

export const changePassword = {
    type: TC,
    args: {
        password: 'String',
    },
    resolve: async (parent, args, context, info) => {
        if (!context.user) {
            throw new AuthenticationError('You must be logged in');
        }

        const code = Math.floor(100000 + Math.random() * 900000);
        await PasswordReset.deleteMany({ user_id: context.user._id });
        await PasswordReset.create({
            user_id: context.user._id,
            code: code,
        });

        await context.mail.sendEmailWithTemplate({
            From: process.env.EMAIL_FROM,
            To: context.user.email,
            TemplateId: '27150297',
            TemplateModel: {
                code: `${code}`,
            },
        });

        return context.user;
    },
};

export const confirmPasswordChangeCode = {
    type: `type CodeResponse { success: Boolean, code: String }`,
    args: {
        code: 'String',
        password: 'String',
    },
    resolve: async (parent, args, context) => {
        try {
            const code = await PasswordReset.findOne({
                code: args.code,
                user_id: context.user._id,
            }).exec();
            if (!code) {
                throw new ValidationError('Code is invalid or does not exist');
            } else {
                await PasswordReset.deleteOne({
                    code: args.code,
                    user_id: context.user._id,
                });
                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $set: {
                            password: await encryptPassword(args.password),
                        },
                    },
                    { new: true }
                );
            }

            return { success: true, code: args.code };
        } catch (e) {
            throw new Error(e);
        }
    },
};
