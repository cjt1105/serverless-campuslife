import db from '../db/db'

export const typeDef = `

    type CalendarEvent {
        id: ID!
        type: String
        description: String
        dueDate: String
    }

    extend type Mutation {
        createCalendarEvent(
            type: String! description: String dueDate: String
        ): CalendarEvent
    }
`

export const resolvers = {
	Mutation: {
		createCalendarEvent: (root, args) => _createCalendarEvent(args)
	}
};

async function _createCalendarEvent(_calendarEvent) {
	return new Promise((resolve, reject) => {
		db.query("CREATE (n:CalendarEvent {calendarEvent}) RETURN n", {calendarEvent: _calendarEvent}, (err, results) => {
			if(err){
				reject(err)
			}
			else {
				console.log(results)
				resolve(results[0])
			}
		})
    })
}