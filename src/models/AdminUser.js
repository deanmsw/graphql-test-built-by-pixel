const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const { composeMongoose } = require('graphql-compose-mongoose');
const { PermissionRoleTC } = require('./PermissionRole');

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        token: {
            type: String,
        },
        reset_token: {
            type: String,
        },
        permission_role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AdminPermissionRole',
            default: null,
        },
        isAdmin: {
            type: Boolean,
            default: true,
        },
    },
    {
        collection: 'admin-users',
    }
);

UserSchema.plugin(timestamps);
UserSchema.set('toObject', { getters: true });

const AdminUser = mongoose.model('AdminUser', UserSchema);
const AdminUserTC = composeMongoose(AdminUser, {});

AdminUserTC.addRelation('permission_role', {
    resolver: () => PermissionRoleTC.mongooseResolvers.findOne(),
    prepareArgs: {
        filter: (source) => ({
            _operators: {
                _id: {
                    in: source.permission_role || [],
                },
            },
        }),
    },
    projection: { permission_role: true },
});

module.exports = { AdminUser, AdminUserTC };
