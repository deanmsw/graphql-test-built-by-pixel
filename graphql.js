const { ApolloServer } = require('apollo-server');
const db = require('./utils/db');
const schema = require('./schema');
const { verifyUser } = require('./utils/auth');
const postmark = require('postmark');

const server = new ApolloServer({
    schema,
    cors: true,
    uploads: false,
    context: async ({ express }) => {
        var mail = new postmark.ServerClient(process.env.POSTMARK);

        const token = express.req.headers.Authorization;

        const { payload: user, loggedIn } = await verifyUser(token);

        let permissions = [];

        return { db, user: user || null, loggedIn, permissions, mail, express };
    },
});

exports.graphqlHandler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true,
    },
});
