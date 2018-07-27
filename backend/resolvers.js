import db from './db/db'



// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
	Query: {
		users: (root, args) => getAllUsers(),
		lectures: (root, args) => getAllLectures(),
		user: (root, args) => getSingleUser(args.id)
	},
	Mutation: {
		createUser: (root, args) => _createUser(args)
	},
	User: {
		lectures: (root, args) => getAllLectures(args.id)
	}
};
