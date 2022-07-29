const { schemaComposer } = require('graphql-compose');
const { PermissionTC } = require('../../models/Permission');
const { AdminUserTC } = require('../../models/AdminUser');

const AdminCurrentUserTC = schemaComposer.createObjectTC({
    name: 'currentAdminUser',
    fields: {
        user: AdminUserTC,
        permissions: [PermissionTC],
        isAdmin: 'Boolean',
    },
});

module.exports = { AdminCurrentUserTC };
