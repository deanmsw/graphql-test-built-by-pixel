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
        collection: 'email-changes',
    }
);

ModelSchema.plugin(timestamps);
ModelSchema.set('toObject', { getters: true });

const EmailChange = mongoose.model('EmailChange', ModelSchema);

const EmailChangeTC = composeMongoose(EmailChange, {});

module.exports = { EmailChangeTC, EmailChange };
