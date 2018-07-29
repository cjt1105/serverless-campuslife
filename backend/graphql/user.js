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
		assignments:[Assignment]
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
		lectures: (user) => getUserLectures(user.id),
		assignments: (user) => getUserAssignments(user.id)
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
		db.query("MATCH (n:User)-[:ATTENDS_LECTURE]-(lectures) WHERE ID(n) = {id} RETURN lectures", {id: _id}, (err, results) => {
			if(err){
				reject(err)
			}
			else {
				resolve(results)
			}
		})
    })
}

function getUserAssignments(_id) {
	return new Promise((resolve, reject) => {
		db.query("MATCH (n:User)-[:ON_CALENDAR]-(assignments) WHERE ID(n) = {id} RETURN assignments", {id: _id}, (err, results) => {
			if(err){
				reject(err)
			}
			else {
				resolve(results)
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