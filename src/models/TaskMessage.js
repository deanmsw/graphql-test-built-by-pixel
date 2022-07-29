const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const { composeMongoose } = require('graphql-compose-mongoose');

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        task_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        recipients: {
            type: [mongoose.Schema.Types.ObjectId],
        },
        messages: {
            type: [
                {
                    text: {
                        type: String,
                    },
                    image: {
                        type: JSON,
                    },
                    is_sent: {
                        type: Boolean,
                    },
                    is_read: {
                        type: Boolean,
                    },
                    author: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                },
            ],
        },
    },
    {
        collection: 'task-messages',
    }
);

ModelSchema.plugin(timestamps);
ModelSchema.set('toObject', { getters: true });

const TaskMessage = mongoose.model('TaskMessage', ModelSchema);

const TaskMessageTC = composeMongoose(TaskMessage, {});

module.exports = { TaskMessageTC, TaskMessage };
