const { schemaComposer } = require('graphql-compose');
const { PermissionTC } = require('../../models/Permission');
const { TC } = require('../../models/User');

const CurrentUserTC = schemaComposer.createObjectTC({
    name: 'CurrentUser',
    fields: {
        user: TC,
        permissions: [PermissionTC],
        isSuperAdmin: 'Boolean',
    },
});

module.exports = { CurrentUserTC };
