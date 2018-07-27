import { server, user, pass } from './db.config'

const db = require("seraph")({
    server: server,
    user: user,
    pass: pass
})

export default db