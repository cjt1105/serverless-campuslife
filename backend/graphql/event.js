import db from '../db/db';

export const typeDef = `
    type Event {
        id: ID!
        name: String!
        date: String!
        time: String!
        invited: [User]
        going: [User]
        comments: [Comment]
    }
`