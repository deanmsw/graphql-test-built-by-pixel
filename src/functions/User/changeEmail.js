import { EmailChange } from '../../models/EmailChanges';
import { TC, User } from '../../models/User';

const { AuthenticationError, ValidationError } = require('apollo-server');

export const changeEmail = {
    type: TC,
    args: {
        email: 'String',
    },
    resolve: async (parent, args, context, info) => {
        if (!context.user) {
            throw new AuthenticationError('You must be logged in');
        }

        const code = Math.floor(100000 + Math.random() * 900000);
        await EmailChange.deleteMany({ user_id: context.user._id });
        await EmailChange.create({
            user_id: context.user._id,
            code: code,
        });
        await context.mail.sendEmailWithTemplate({
            From: process.env.EMAIL_FROM,
            To: context.user.email,
            TemplateId: '27160289',
            TemplateModel: {
                code: `${code}`,
            },
        });

        return context.user;
    },
};

export const confirmEmailChangeCode = {
    type: `type CodeResponse { success: Boolean, code: String }`,
    args: {
        code: 'String',
        email: 'String',
    },
    resolve: async (parent, args, context) => {
        try {
            const code = await EmailChange.findOne({
                code: args.code,
                user_id: context.user._id,
            }).exec();
            if (!code) {
                throw new ValidationError('Code is invalid or does not exist');
            } else {
                await EmailChange.deleteOne({
                    code: args.code,
                    user_id: context.user._id,
                });
                await User.updateOne(
                    { _id: context.user._id },
                    {
                        $set: {
                            email: args.email,
                        },
                    }
                );
            }

            return { success: true, code: args.code };
        } catch (e) {
            throw new Error(e);
        }
    },
};
