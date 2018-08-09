import db from '../db/db'

export const typeDef = `
    extend type Query {
        lectures: [Lecture]
        lecture(lectureID: Int): Lecture
    }

    type Lecture {
        id: ID!
        professor: String
        section: Int
        name: String
        days: String
        time: String
        students: [User]
        teachers_assistants: [User]
        posts: [Post]
        assignments: [Assignment]
    }

    extend type Mutation {
        addStudent(
            lectureID: Int!
            userID: Int!
        ): Lecture
        addTeachersAssistant(
            lectureID: Int!
            userID: Int!
        ): Lecture
    }
`

export const resolvers = {
	Query: {
        lectures: (root, args) => getAllLectures(),
        lecture: (root, args) => getSingleLecture(args.lectureID)
    },
    Lecture: {
        assignments: (lecture) => getAssignments(lecture.id)
    }
};

function getAllLectures() {
	return new Promise((resolve, reject) => {
		db.query("MATCH (n:Lecture) RETURN n", (err, results) => {
			if(err){
				reject(err)
			}
			else {
				resolve(results)
			}
		})
    })
}

function getSingleLecture(id){
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

function getAssignments(id) {
    return new Promise((resolve, reject) => {
        db.query("MATCH (n:Lecture)-[:ON_CALENDAR]-(assignments) WHERE ID(n) = {lectureID} RETURN assignments", {lectureID: id}, (err, results) => {
            if(err){
                reject(err)
            }
            else{
                resolve(results)
            }
        })
    })
}