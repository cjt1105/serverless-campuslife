import db from '../db/db'

export const typeDef = `
    extend type Query {
        lectures: [Lecture]
    }

    type Lecture {
        id: ID!
        professor: String
        section: Int
        name: String
        days: String
        time: String
    }
`

export const resolvers = {
	Query: {
		lectures: (root, args) => getAllLectures()
	}
};

async function getAllLectures() {
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