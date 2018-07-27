const schema = `

type Query {
    users: [User]
    lectures: [Lecture]
    user(id: Int!): User
}

type User {
    id: ID!
    email: String
    firstName: String
    lastName: String
    year: String
    lectures: [Lecture]
}

type UserInput {
    email: String
    firstName: String
    lastName: String
    year: String
}

type Lecture {
    id: ID!
    professor: String
    section: Int
    name: String
    days: String
    time: String
}

type Mutation {
    createUser(
        email: String! firstName: String lastName: String
    ): User
  }

schema {
    query: Query
    mutation: Mutation
}`;

// eslint-disable-next-line import/prefer-default-export
export { schema };
