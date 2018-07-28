import db from '../db/db'

export const typeDef = `

    type Assignment {
        id: ID!
        type: String
        description: String
        dueDate: String
    }

    extend type Mutation {
        createAssignment(
            type: String!
            description: String
            dueDate: String
        ): Assignment
        addAssignmentToLecture(
            assignmentID: Int!
            lectureID: Int!
        ): Assignment
    }
`

export const resolvers = {
	Mutation: {
        addAssignmentToLecture: (root, args) => _addAssignmentToLecture(args.assignmentID, args.lectureID),
        createAssignment: (root, args) => _createAssignment(args)
	}
};

function _createAssignment(_assignment) {
	return new Promise((resolve, reject) => {
		db.query("CREATE (n:Assignment {assignment}) RETURN n", {assignment: _assignment}, (err, results) => {
			if(err){
				reject(err)
			}
			else {
				resolve(results[0])
			}
		})
    })
}

function _addAssignmentToLecture(_assignmentID, _lectureID) {
	return new Promise((resolve, reject) => {
        db.query(
            "MATCH (assignment:Assignment) WHERE ID(assignment) = {assignmentID} MATCH (lecture:Lecture)-[:ATTENDS_LECTURE]-(students) WHERE ID(lecture) = {lectureID} CREATE (assignment)-[:ON_CALENDAR]->(lecture) CREATE (assignment)-[:ON_CALENDAR]->(students) RETURN assignment",
            {assignmentID: _assignmentID, lectureID: _lectureID},
            (err, results) => {
                if(err){
                    reject(err)
                }
                else {
                    resolve(results[0])
                }
            })
    })
}