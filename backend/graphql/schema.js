const { buildSchema } = require('graphql');
const Task = require('../models/Task');

const schema = buildSchema(`
    type Task {
        id: ID
        title: String
        description: String
        status: String
        createdAt: String
        updatedAt: String
    }

    type Query {
        getTasks: [Task]
    }

    type Mutation {
        createTask(title: String!, description: String!, status: String): Task
        updateTask(id: ID!, title: String, description: String, status: String): Task
        deleteTask(id: ID!): String
    }
`);

const root = {
    getTasks: async () => {
        return await Task.find();
    },
    createTask: async ({ title, description, status }) => {
        const newTask = new Task({ title, description, status });
        return await newTask.save();
    },
    updateTask: async ({ id, title, description, status }) => {
        return await Task.findByIdAndUpdate(id, { title, description, status }, { new: true });
    },
    deleteTask: async ({ id }) => {
        await Task.findByIdAndDelete(id);
        return 'Task deleted';
    }
};

module.exports = { schema, root };
