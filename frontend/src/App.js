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

const cache = new InMemoryCache()

const authLink = setContext((request) => new Promise( (resolve, reject) => {
  Auth.currentSession()
  .then(session => {
    const token = session.idToken.jwtToken;
    console.log(token)
    resolve({
      headers: { Authorization: token }
    });
  })
}));

// const stateLink = withClientState({ ...clientState, cache });

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    authLink,
    new HttpLink({uri: "https://3kf1qnt9h8.execute-api.us-east-1.amazonaws.com/production/graphql" })
  ])
});

Amplify.configure({
  API: {
    graphql_endpoint: "https://3kf1qnt9h8.execute-api.us-east-1.amazonaws.com/production/graphql"
  },
  Auth: {
    identityPoolId: "us-east-1:79a32e49-6b8e-464e-862b-6c14be2f039a",
    region: process.env.REACT_APP_AWS_AUTH_REGION, // REQUIRED - Amazon Cognito Region
    userPoolId: "us-east-1_hdGTZdrRr", // OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: "4qp171f4fm0dt1m2dh0ep8tb1d", // User Pool App Client ID
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
