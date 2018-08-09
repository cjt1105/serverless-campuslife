import db from '../db/db'

export const typeDef = `
    extend type Query {
        comment(id: Int!): Comment
    }

    type Comment {
        id: ID!
        body: String!
        poster: User!
    }

    extend type Mutation {
        createComment(
            body: String!
            posterID: Int!
            originID: Int!
        ): Comment
    }
`

export const resolvers = {
    Mutation: {
        createComment: (root, args) => createComment(args)
    },
    Comment: {
        poster: (comment) => getPoster(comment.id)
    }
}

/// Query functions
function getPoster(id) {
    return new Promise((resolve, reject) => {
        db.query("MATCH (n:Comment)-[:COMMENTED_BY]-(poster) WHERE ID(n) = {commentID} RETURN poster", {commentID: id}, (err, results) => {
            if(err){
                reject(err)
            }
            else{
                resolve(results[0])
            }
        })
    })
}

function createComment(comment) {
    return new Promise((resolve, reject) => {
        //// create comment and relationships to user and post/assignment/comment
        const txn = db.batch();
        const _comment = txn.save(comment);

        txn.label(_comment, 'Comment')
        txn.relate(_comment, 'COMMENTED_BY');
        txn.relate(_comment, 'COMMENT_ORIGIN')
        txn.commit((err, results) => {
            if(err){
                reject(err)
            }
            else {
                resolve(results[0])
            }
        })
    })
}
