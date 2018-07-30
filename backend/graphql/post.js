import db from '../db/db'

export const typeDef = `
    extend type Query {
        post(id: Int!): Post
    }

    type Post {
        id: ID!
        body: String!
        poster: User!
    }

    extend type Mutation {
        createPost(
            body: String!
            posterID: Int!
        ): Post
        addPostSource(
            postID: Int!
            sourceID: Int!
        ): Relationship
    }
`

export const resolvers = {
    Query: {
        post: (root, args) => getSinglePost(args.id)
    },
    Mutation: {
        createPost: (root, args) => createPost(args),
        addPostSource: (root, args) => addPostSource(args)
    },
    Post: {
        poster: (post) => getPoster(post.id)
    }
}

function createPost(post) {
    return new Promise((resolve, reject) => {
        /// save post to db
        db.save({body: post.body}, 'Post', (err, node) => {
            if(err){
                reject(err)
            }
            else {
                // add relationship between post and poster
                db.relate(node.id, 'POSTED_BY', post.posterID, (err, rel) => {})
                resolve(node)
            }
        })
    })
}

function getPoster(id) {
    return new Promise((resolve, reject) => {
        db.query("MATCH (n:Post)-[:POSTED_BY]-(poster) WHERE ID(n) = {postID} RETURN poster", {postID: id}, (err, results) => {
            if(err){
                reject(err)
            }
            else{
                resolve(results[0])
            }
        })
    })
}

function getSinglePost(id){
    return new Promise((resolve, reject) => {
        db.read(id, (err, node) => {
            if(err){
                reject(err)
            }
            else{
                resolve(node)
            }
        })
    })
}

function addPostSource(args){
    return new Promise((resolve, reject) => {
        db.relate(args.postID, 'POSTED_IN', args.sourceID, (err, rel) => {
            if(err){
                reject(err)
            }
            else {
                resolve(rel)
            }
        })
    })
}