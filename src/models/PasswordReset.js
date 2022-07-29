const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const { composeMongoose } = require('graphql-compose-mongoose');

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        code: {
            type: String,
        },
    },
    {
        collection: 'password-resets',
    }
);

ModelSchema.plugin(timestamps);
ModelSchema.set('toObject', { getters: true });

const PasswordReset = mongoose.model('PasswordReset', ModelSchema);

const PasswordResetTC = composeMongoose(PasswordReset, {});

module.exports = { PasswordResetTC, PasswordReset };
