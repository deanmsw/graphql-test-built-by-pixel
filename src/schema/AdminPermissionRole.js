const { PermissionRoleTC } = require('../models/PermissionRole');

const { authMiddleware } = require('../utils/auth');

const Query = {
    getPermissionRole: PermissionRoleTC.mongooseResolvers
        .findById()
        .withMiddlewares([authMiddleware]),
    listPermissionRoles: PermissionRoleTC.mongooseResolvers
        .pagination()
        .withMiddlewares([authMiddleware]),
};

const Mutation = {
    editPermissionRole: PermissionRoleTC.mongooseResolvers
        .updateOne()
        .withMiddlewares([authMiddleware]),
    createPermissionRole: PermissionRoleTC.mongooseResolvers
        .createOne()
        .withMiddlewares([authMiddleware]),
};

module.exports = { Query, Mutation };
