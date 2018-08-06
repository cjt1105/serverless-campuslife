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

    extend type Query {

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
        /// save comment to db
        db.save({body: comment.body}, 'Comment', (err, node) => {
            if(err){
                reject(err)
            }
            else {
                // add relationship between comment and commenter
                db.relate(node.id, 'COMMENTED_BY', comment.posterID, (err, rel) => {})
                db.relate(node.id, 'COMMENT_ORIGIN', comment.originID, (err, rel) => {})
                resolve(node)
            }
        })
    })
}
