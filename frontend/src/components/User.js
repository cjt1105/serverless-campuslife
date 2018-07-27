import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Div = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
`;

const Container = styled.div`
  margin: auto;
  width: 600px;
  max-width: 100%;
  text-align: left;
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0px 1px 1px 0 rgba(0, 0, 0, 0.3);
`;

const UserProfile = styled.div`
  margin-bottom: 30px;
  padding: 15px 15px;
  text-align: center;
  & .username {
    color: #14171a;
    font-size: 16px;
    font-weight: bold;
  }
  & .username span {
    font-size: 14px;
    color: #657786;
  }
  & .location {
    color: #657786;
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .description {
    margin-top: 15px;
  }
  & .material-icons {
    font-size: 16px;
  }
`;

const Numbers = styled.div`
  display: flex;
  margin-top: 30px;
  margin-bottom: 30px;
  & .column {
    color: #657786;
    flex: 1;
    text-align: center;
    padding: 15px 0;
  }
  & .title {
    font-size: 12px;
    font-weight: bold;
  }
  & .number {
    font-size: 18px;
    font-weight: bold;
    margin-top: 3px;
  }
`;

const Tweet = styled.div`
  border-bottom: 1px solid #e6ecf0;
  padding: 15px 15px;
  font-size: 14px;
  line-height: 20px;
`;

function User({ user }) {
  return (
    <Div>
      <Container>
        <UserProfile>
          <h4 className="username">
            {user.name}
          </h4>
          <p className="location">
            <i className="material-icons">location_on</i>
            {user.location}
          </p>
          <p className="description">{user.description}</p>
        </UserProfile>
      </Container>
    </Div>
  );
}

User.propTypes = {
  user: PropTypes.any.isRequired, // eslint-disable-line
};

export default User;
