const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const { composeMongoose } = require('graphql-compose-mongoose');
const { PermissionRoleTC } = require('./PermissionRole');

const { Schema } = mongoose;
const UserSchema = new Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        is_profile_complete: {
            type: Boolean,
        },
        profile_picture: {
            type: JSON,
        },
        goal: {
            type: String,
        },
        tasker_review_count: { type: Number },
        tasker_review_average: { type: Number },
        asker_review_count: { type: Number },
        asker_review_average: { type: Number },
        profile_description: {
            type: String,
        },
        dob: {
            type: Date,
        },
        addressInput: {
            place_id: {
                type: String,
            },
            term: {
                type: String,
            },
            town: {
                type: String,
            },
        },
        location: {
            lat: {
                type: Number,
            },
            lng: {
                type: Number,
            },
            radius: {
                type: Number,
            },
        },
        saved_task_messages: {
            type: [String],
        },
        liked_tasks: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
        },
        roles: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'UserRole',
            index: true,
        },
        password: {
            type: String,
        },
        token: {
            type: String,
        },
        tokenExpiry: {
            type: Date,
        },
        reset_token: {
            type: String,
        },
        has_password: {
            type: Boolean,
        },
        permission_role: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'PermissionRole',
            nullable: true,
        },
        is_admin: {
            type: Boolean,
        },
        phone: {
            type: String,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        notification_preferences: {
            type: JSON,
        },
    },
    {
        collection: 'users',
    }
);

UserSchema.plugin(timestamps);
UserSchema.set('toObject', { getters: true });

const User = mongoose.model('User', UserSchema);

const TC = composeMongoose(User, {});

TC.addRelation('permission_role', {
    resolver: () => PermissionRoleTC.mongooseResolvers.findMany(),
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

module.exports = { User, TC };
