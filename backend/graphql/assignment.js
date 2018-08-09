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
            description: String!
            dueDate: String!
            lectureID: Int!
        ): Assignment
    }
`

export const resolvers = {
	Mutation: {
        createAssignment: (root, args) => _createAssignment(args)
	}
};

function _createAssignment(args) {
    const lectureID = args.lectureID;
    const assignment = {
        type: args.type,
        description: args.description,
        dueDate: args.dueDate
    };

    return new Promise((resolve, reject) => {
        const txn = db.batch();
        const _assignment = txn.save(assignment);
        txn.label(_assignment, 'Assignment')
        txn.relate(_assignment, 'ON_CALENDAR', lectureID);
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