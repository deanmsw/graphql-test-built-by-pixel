const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const { composeMongoose } = require('graphql-compose-mongoose');

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: JSON,
        },
    },
    {
        collection: 'pages',
    }
);

ModelSchema.plugin(timestamps);
ModelSchema.set('toObject', { getters: true });

const Page = mongoose.model('Page', ModelSchema);

const PageTC = composeMongoose(Page, {});

module.exports = { PageTC, Page };
