const { authMiddleware } = require('../../utils/auth');

const generateQueries = (config) => {
    let obj = {};

    if (config.get.create) {
        obj[`${config.name}Get`] = config.TC.mongooseResolvers
            .findOne()
            .withMiddlewares(config.get.auth ? [authMiddleware] : []);
    }
    if (config.list.create) {
        obj[`${config.name}List`] = config.TC.mongooseResolvers
            .findMany()
            .addFilterArg({
                name: 'search',
                type: 'String',
                query: (query, value) => {
                    if (value) {
                        query.$text = { $search: value };
                    }
                },
            })
            .withMiddlewares(config.list.auth ? [authMiddleware] : []);
    }
    return obj;
};

const generateMutations = (config) => {
    let obj = {};

    if (config.edit.create) {
        obj[`${config.name}Edit`] = config.TC.mongooseResolvers
            .updateOne()
            .withMiddlewares(config.edit.auth ? [authMiddleware] : []);
    }
    if (config.create.create) {
        obj[`${config.name}Create`] = config.TC.mongooseResolvers
            .createOne()
            .withMiddlewares(config.create.auth ? [authMiddleware] : []);
    }
    if (config.delete) {
        obj[`${config.name}Delete`] = config.TC.mongooseResolvers
            .removeById()
            .withMiddlewares(config.create.auth ? [authMiddleware] : []);
    }
    return obj;
};

module.exports = { generateQueries, generateMutations };
