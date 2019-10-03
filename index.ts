import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { importSchema } from 'graphql-import'
import graphqlHTTP from 'express-graphql'
import bodyParser from 'body-parser'

import { buildSchema } from 'graphql'
import { root } from './resolvers/root-resolver'
import AuthenticateRoute, { LogOutRoute } from './authentication/api.auth'

// Import schema
const typeDefs = importSchema('schema/schema.graphql')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(typeDefs);

var app = express();

app.use(bodyParser.json())

app.post('/authenticate', AuthenticateRoute)

app.get('/logout', LogOutRoute)

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root(),
  graphiql: true,
}));


app.listen(4000, () => {
  console.log('\x1b[36m%s\x1b[0m','----- Server started on http://localhost:4000 -----');
});