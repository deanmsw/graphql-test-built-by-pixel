const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const { composeMongoose } = require('graphql-compose-mongoose');
const { PermissionTC } = require('./Permission');

const { Schema } = mongoose;

const PermissionRoleSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        permissions: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Permission',
        },
    },
    {
        collection: 'permission_roles',
    }
);

PermissionRoleSchema.plugin(timestamps);
PermissionRoleSchema.set('toObject', { getters: true });

const PermissionRole = mongoose.model('PermissionRole', PermissionRoleSchema);

const PermissionRoleTC = composeMongoose(PermissionRole, {});

PermissionRoleTC.addRelation('permissions', {
    resolver: () => PermissionTC.mongooseResolvers.findMany(),
    prepareArgs: {
        filter: (source) => ({
            _operators: {
                _id: {
                    in: source.permissions || [],
                },
            },
        }),
    },
    projection: { permissions: true },
});

module.exports = { PermissionRoleTC, PermissionRole };
