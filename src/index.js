const dotenv = require("dotenv");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload");
const mongoose = require("mongoose");

const db = require("./utils/db");
const schema = require("./schema");
const { verifyUser } = require("./utils/auth");
// const routes from './routes';

const postmark = require("postmark");
const cors = require("cors");

dotenv.config();

async function startApolloServer() {
  const server = new ApolloServer({
    schema,
    cors: true,
    uploads: false,
    playground: process.env.NODE_ENV !== "production" ? true : false,
    introspection: true,
    tracing: process.env.NODE_ENV !== "production" ? true : false,

    path: "/graphql",
    context: async ({ req }) => {
      let currentUser = null;

      const token = req.headers.authorization;

      const { payload: user, loggedIn } = await verifyUser(token);

      let permissions = [];

      if (!user) {
        currentUser = null;
      }

      return { db, user: user || null, loggedIn, permissions };
    },
  });

  await server.start();

  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(graphqlUploadExpress());

  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: true,
    onHealthCheck: () =>
      // eslint-disable-next-line no-undef
      new Promise((resolve, reject) => {
        if (mongoose.connection.readyState > 0) {
          resolve();
        } else {
          reject();
        }
      }),
  });

  // app.use('/api', routes);

  await new Promise((resolve) =>
    app.listen({ port: process.env.PORT || 3001 }, resolve)
  );
  console.log(
    `🚀 Server listening and live  on port ${process.env.PORT}/${server.graphqlPath}`
  );
}
startApolloServer();
