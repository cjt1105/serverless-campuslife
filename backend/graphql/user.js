import db from '../db/db';

export const typeDef = `
    extend type Query {
        users: [User]
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

    extend type Mutation {
        createUser(
            email: String! firstName: String lastName: String
        ): User
    }
`

export const resolvers = {
	Query: {
		users: (root, args) => getAllUsers(),
		user: (root, args) => getSingleUser(args.id)
	},
	Mutation: {
		createUser: (root, args) => _createUser(args)
	},
	User: {
		lectures: (root, args) => getAllLectures(args.id)
	}
};
//// Query functions
function getAllUsers() {
	return new Promise((resolve, reject) => {
		db.query("MATCH (n:User) RETURN n", (err, results) => {
			if(err){
				reject(err)
			}
			else {
				resolve(results)
			}
		})
	})
}

function getSingleUser(_id) {
	return new Promise((resolve, reject) => {
		db.query("MATCH (n:User) WHERE ID(n) = {id} RETURN n", {id: _id}, (err, results) => {
			if(err){
				reject(err)
			}
			else {
				resolve(results[0])
			}
		})
    })
}

function getUserLectures(_id) {
	return new Promise((resolve, reject) => {
		db.query("MATCH (n:User)-[r]-(lectures) WHERE ID(n) = {id} RETURN lectures", {id: _id}, (err, results) => {
			if(err){
				reject(err)
			}
			else {
				resolve(results[0])
			}
		})
    })
}
/// Mutation functions
function _createUser(_user) {
	return new Promise((resolve, reject) => {
		db.query("CREATE (n:User {user}) RETURN n", {user: _user}, (err, results) => {
			if(err){
				reject(err)
			}
			else {
				resolve(results[0])
			}
		})
    })
}