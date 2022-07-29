const { PermissionTC } = require('../models/Permission');

const { authMiddleware } = require('../utils/auth');

const Query = {
    getPermission: PermissionTC.mongooseResolvers
        .findById()
        .withMiddlewares([authMiddleware]),
    listPermission: PermissionTC.mongooseResolvers
        .pagination()
        .withMiddlewares([authMiddleware]),
};

const Mutation = {
    editPermission: PermissionTC.mongooseResolvers
        .updateOne()
        .withMiddlewares([authMiddleware]),
    createPermission: PermissionTC.mongooseResolvers
        .createOne()
        .withMiddlewares([authMiddleware]),
};

module.exports = { Query, Mutation };
