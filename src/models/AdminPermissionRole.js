const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const { composeMongoose } = require('graphql-compose-mongoose');
const { PermissionTC } = require('./Permission');

const { Schema } = mongoose;

const AdminPermissionRoleSchema = new Schema(
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
        collection: 'admin-permission-roles',
    }
);

AdminPermissionRoleSchema.plugin(timestamps);
AdminPermissionRoleSchema.set('toObject', { getters: true });

const AdminPermissionRole = mongoose.model(
    'AdminPermissionRole',
    AdminPermissionRoleSchema
);

const AdminPermissionRoleTC = composeMongoose(AdminPermissionRole, {});

AdminPermissionRoleTC.addRelation('permissions', {
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

module.exports = { AdminPermissionRoleTC, AdminPermissionRole };
