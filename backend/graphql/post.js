import db from '../db/db'

export const typeDef = `
    extend type Query {
        post(id: Int!): Post
    }

    type Post {
        id: ID!
        body: String!
        poster: User!
        comments: [Comment]
    }

    extend type Mutation {
        createPost(
            body: String!
            posterID: Int!
        ): Post
        addPostOrigin(
            postID: Int!
            originID: Int!
        ): Relationship
    }
`

export const resolvers = {
    Query: {
        post: (root, args) => getSinglePost(args.id)
    },
    Mutation: {
        createPost: (root, args) => createPost(args),
        addPostOrigin: (root, args) => addPostOrigin(args)
    },
    Post: {
        poster: (post) => getPoster(post.id),
        comments: (post) => getComments(post.id)
    }
}
/// Mutation functions
function createPost(post) {
    return new Promise((resolve, reject) => {
        const txn = db.batch();
        const _post = txn.save({body: post.body});
        txn.label(_post, 'Post')
        txn.relate(_post, 'POSTED_BY', post.posterID);
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

function addPostOrigin(args){
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
/// Query functions
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

function getComments(id) {
    return new Promise((resolve, reject) => {
        db.query("MATCH (n:Post)-[:COMMENT_ORIGIN]-(comments) WHERE ID(n) = {postID} RETURN comments", {postID: id}, (err, results) => {
            if(err){
                reject(err)
            }
            else{
                resolve(results)
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