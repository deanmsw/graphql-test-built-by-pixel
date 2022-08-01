const {
    generateQueries,
    generateMutations,
} = require('../functions/General/generateCrud');
const { createCategory } = require('../functions/Categories/createCategory');
const { CategoryTC, Category } = require('../models/Category');

const Query = {
    ...generateQueries({
        TC: CategoryTC,
        name: 'category',
        get: { create: true, auth: true },
        list: { create: true, auth: true },
    }),
};

const Mutation = {
    ...generateMutations({
        TC: CategoryTC,
        name: 'category',
        edit: { create: true, auth: true },
        create: { create: false, auth: true },
        delete: {delete: true, auth: true}
    }),
    categoryCreate: createCategory,
};

module.exports = { Query, Mutation };
