require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const app = express();
const port = process.env.PORT | 4000;
const db = require("./src/db");
const DB_HOST = process.env.DB_HOST;
const models = require("./src/models/index");
const typeDefs = require("./src/schemas/schema");
const resolvers = require("./src/resolvers/index");
const jwt = require("jsonwebtoken")
const helmet = require("helmet");
const cors = require("cors")
const depthLimit = require("graphql-depth-limit")
 const { createComplexityLimitRule } = require('graphql-validation-complexity')
let apolloServer = null;


app.use(cors())
app.use(helmet())
async function startServer() {
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    context: ({req}) => {
      const toket = req.headers.authorization;
      const user = getUser(toket);
      return { models , user };
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}
const getUser = (token) =>{
    if(token) {
      try {
         return jwt.verify(token,process.env.JWT_SECRET);
      } catch (error) {
          new Error('Session invalid');
      }
    }
}

try {
  db.connect(DB_HOST);
  startServer();
  app.listen({ port }, () =>
    console.log(
      `GraphQL Server running at http://localhost:${port}${apolloServer.graphqlPath}`
    )
  );
} catch (error) {
  console.log(error);
}
