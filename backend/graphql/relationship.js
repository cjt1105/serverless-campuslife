import db from '../db/db'

export const typeDef = `
    union Node = User  | Post | Lecture | Assignment

    type Relationship {
        id: ID!
        start: Int!
        end: Int!
        type: String!
    }
`