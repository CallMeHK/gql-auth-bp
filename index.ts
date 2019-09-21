import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { importSchema } from 'graphql-import'
import graphqlHTTP from 'express-graphql'
import bodyParser from 'body-parser'

import { buildSchema } from 'graphql'
import { root } from './resolvers/root-resolver'
import AuthenticateRoute from './authentication/authenticate'

// Import schema
const typeDefs = importSchema('schema/schema.graphql')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(typeDefs);

var app = express();

app.use(bodyParser.json())

app.post('/auth', AuthenticateRoute)

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root(),
  graphiql: true,
}));


app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');