const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const { composeMongoose } = require('graphql-compose-mongoose');

const { Schema } = mongoose;

const PermissionSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        code: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'permissions',
    }
);

PermissionSchema.plugin(timestamps);
PermissionSchema.set('toObject', { getters: true });

const Permission = mongoose.model('Permission', PermissionSchema);

const PermissionTC = composeMongoose(Permission, {});

module.exports = { PermissionTC, Permission };
