import 'babel-polyfill';
import { graphqlLambda, graphiqlLambda } from 'apollo-server-lambda';
import lambdaPlayground from 'graphql-playground-middleware-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import {
  typeDef as User,
  resolvers as userResolvers
} from './graphql/user';
import {
  typeDef as Lecture,
  resolvers as lectureResolvers
} from './graphql/lecture';
import {
  typeDef as Assignment,
  resolvers as assignmentResolvers
} from './graphql/assignment';
import {
  typeDef as Post,
  resolvers as postResolvers
} from './graphql/post';
import {
  typeDef as Relationship,
  resolvers as relationshipResolvers
} from './graphql/relationship';
import {
  typeDef as Comment,
  resolvers as commentResolvers
} from './graphql/comment';
import {
  typeDef as Residence,
  resolvers as residenceResolvers
} from './graphql/residence';
import {
  typeDef as Event
  // resolvers as eventResolvers
} from './graphql/event';

// set up base query and mutation types and resolver object to allow for schema modularization
const Query = `
    type Query {
        _empty: String
    }
`

const Mutation = `
    type Mutation {
        _empty: String
    }
`

const resolvers = {};

const myGraphQLSchema = makeExecutableSchema({
    typeDefs: [
      Query,
      Mutation,
      User,
      Lecture,
      Assignment,
      Post,
      Relationship,
      Comment,
      Residence,
      Event
    ],
    resolvers: merge(
      resolvers,
      userResolvers,
      lectureResolvers,
      assignmentResolvers,
      postResolvers,
      relationshipResolvers,
      commentResolvers,
      residenceResolvers
    ),
    logger: console,
});

exports.graphqlHandler = function graphqlHandler(event, context, callback) {
  function callbackFilter(error, output) {
    output.headers['Access-Control-Allow-Origin'] = '*';
    callback(error, output);
  }

  const handler = graphqlLambda({ schema: myGraphQLSchema, tracing: true });
  return handler(event, context, callbackFilter);
};

// for local endpointURL is /graphql and for prod it is /stage/graphql
exports.playgroundHandler = lambdaPlayground({
  endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT
    ? process.env.REACT_APP_GRAPHQL_ENDPOINT
    : '/production/graphql',
});

exports.graphiqlHandler = graphiqlLambda({
  endpointURL: process.env.REACT_APP_GRAPHQL_ENDPOINT
    ? process.env.REACT_APP_GRAPHQL_ENDPOINT
    : '/production/graphql',
});
