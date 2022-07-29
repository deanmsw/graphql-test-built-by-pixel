const {
    generateQueries,
    generateMutations,
} = require('../functions/General/generateCrud');
const { TaskMessageTC } = require('../models/TaskMessage');

const Query = {
    ...generateQueries({
        TC: TaskMessageTC,
        name: 'taskMessage',
        get: { create: true, auth: true },
        list: { create: true, auth: true },
    }),
};

const Mutation = {
    ...generateMutations({
        TC: TaskMessageTC,
        name: 'taskMessage',
        edit: { create: true, auth: true },
        create: { create: true, auth: true },
    }),
};

module.exports = { Query, Mutation };
