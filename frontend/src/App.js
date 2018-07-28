import React, { Component } from 'react';
import UserList from './components/UserList';
import logo from './logo.svg';
import './App.css';

import { ApolloClient } from 'apollo-client';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import gql from "graphql-tag"
import { Auth } from 'aws-amplify';
import {
  identityPoolId,
  region,
  userPoolId,
  userPoolWebClientId,
  graphqlEndpoint
} from './amplify.config';

const cache = new InMemoryCache()

const authLink = setContext((request) => new Promise( (resolve, reject) => {
  Auth.currentSession()
  .then(session => {
    const token = session.idToken.jwtToken;
    console.log(token)
    resolve({
      headers: { Authorization: `Bearer ${token}` }
    });
  })
}));

// const stateLink = withClientState({ ...clientState, cache });

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    authLink,
    new HttpLink({uri: graphqlEndpoint })
  ])
});

Amplify.configure({
  API: {
    graphql_endpoint: graphqlEndpoint
  },
  Auth: {
    identityPoolId: identityPoolId,
    region: region, // REQUIRED - Amazon Cognito Region
    userPoolId: userPoolId, // OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: userPoolWebClientId, // User Pool App Client ID
  }
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <div className="App-User">
            <UserList />
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default withAuthenticator(App);
