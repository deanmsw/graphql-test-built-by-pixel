const { AuthenticationError } = require('apollo-server');
const { User } = require('../../models/User');

const activateUser = {
    type: `type ActivateResponse {success: Boolean}`,
    args: {
        user_id: 'ID',
    },
    resolve: async (parent, args, context, info) => {
        if (!context.user) {
            throw new AuthenticationError('Must be logged in');
        }
        await User.updateOne(
            { _id: args.user_id },
            { $set: { is_active: true } }
        );

        return { success: true };
    },
};

const deactivateUser = {
    type: `type ActivateResponse {success: Boolean}`,
    args: {
        user_id: 'ID',
    },
    resolve: async (parent, args, context, info) => {
        if (!context.user) {
            throw new AuthenticationError('Must be logged in');
        }
        const user = await User.findByIdAndUpdate(
            { _id: args.user_id },
            { $set: { is_active: false } },
            { new: true }
        );

        await context.mail.sendEmail({
            From: process.env.EMAIL_FROM,
            To: user.email,
            Subject: 'Your AskTask account has been suspended',
            TextBody: `Your account has been sunspended... email content to be confirmed`,
        });

        return { success: true };
    },
};

module.exports = { activateUser, deactivateUser };
