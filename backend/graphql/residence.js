import db from '../db/db';

export const typeDef = `
    type Residence {
        id: ID!
        name: String!
        address: String!
        lat: Float!
        lng: Float!
        posts: [Post]
        events: [Event]
    }

    extend type Mutation {
        createResidence(
            name: String!
            address: String!
            lat: Float!
            lng: Float!
        ): Residence
    }
`

export const resolvers = {
    Mutation: {
        createResidence: (root, args) => createResidence(args)
    }
}

function createResidence(residence) {
    return new Promise((resolve, reject) => {
        db.query(
            "CREATE (n:Residence {residence}) RETURN n",
            {residence: residence},
            (err, results) => {
                if(err){
                    reject(err)
                }
                else {
                    resolve(results[0])
                }
            }
    )
    })
}