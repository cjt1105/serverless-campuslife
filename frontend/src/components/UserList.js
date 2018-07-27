import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import User from './User';
import { URL } from 'url';
import API, { graphqlOperation } from "@aws-amplify/api";
import { Auth } from 'aws-amplify';

const ListEvents = `query allUsers {
  users {
    email
  }
}`;

export default class UserList extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: true}
  }

  componentDidMount = async () => {
    const allEvents = await API.graphql(graphqlOperation(ListEvents));
    const session = await Auth.currentSession()
    console.log(allEvents)
    console.log(session)
  }

  render() {
    return null
  }
}

