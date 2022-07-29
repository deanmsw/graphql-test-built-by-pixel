const {
    generateQueries,
    generateMutations,
} = require('../functions/General/generateCrud');
const { PageTC } = require('../models/Pages');

const Query = {
    ...generateQueries({
        TC: PageTC,
        name: 'page',
        get: { create: true, auth: true },
        list: { create: true, auth: false },
    }),
};

const Mutation = {
    ...generateMutations({
        TC: PageTC,
        name: 'page',
        edit: { create: true, auth: true },
        create: { create: true, auth: true },
    }),
};

module.exports = { Query, Mutation };
