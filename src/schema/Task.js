const {
    generateQueries,
    generateMutations,
} = require('../functions/General/generateCrud');
const { createTask } = require('../functions/Tasks/createTask');
const {
    taskDetailsVerification,
} = require('../functions/Tasks/taskDetailsVerification');
const { TaskTC } = require('../models/Task');

const Query = {
    ...generateQueries({
        TC: TaskTC,
        name: 'task',
        get: { create: true, auth: true },
        list: { create: true, auth: false },
    }),
};

const Mutation = {
    ...generateMutations({
        TC: TaskTC,
        name: 'task',
        edit: { create: true, auth: true },
        create: { create: false, auth: true },
    }),
    taskCreate: createTask,
    taskDetailsVerification: taskDetailsVerification,
};

module.exports = { Query, Mutation };
