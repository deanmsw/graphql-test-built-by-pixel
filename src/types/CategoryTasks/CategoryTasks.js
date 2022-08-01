const { schemaComposer } = require('graphql-compose');
const { CategoryTC } = require('../../models/Category');
const { TaskTC } = require('../../models/Task');

const CategoryTasksTC = schemaComposer.createObjectTC({
    name: 'categoryTasks',
    fields: {
        category: CategoryTC,
        tasks: [TaskTC],
    },
});

module.exports = { CategoryTasksTC };
