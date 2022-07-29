const { TC, User } = require('../../models/User');
const { ValidationError } = require('apollo-server');
const { encryptPassword } = require('../../utils/auth');
const { PasswordReset } = require('../../models/PasswordReset');

const resetPassword = {
    type: TC,
    args: {
        code: 'String',
        password: 'String',
    },
    resolve: async (parent, args, context, info) => {
        const code = await PasswordReset.findOne({ code: args.code });
        // Check If User Exists Already Throw Error
        if (!code) {
            throw new ValidationError('The code provided is invalid');
        } else {
            const user = await User.findOneAndUpdate(
                { _id: code.user_id },
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

            await PasswordReset.deleteOne({ code: args.code });

            return user.toObject();
        }
    },
};

module.exports = { resetPassword };
