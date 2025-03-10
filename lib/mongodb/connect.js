import { connect, connection } from "mongoose";

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export default async function connectDB() {
    if (cached.conn) {
        console.log('reusing existing db connection')
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = connect(process.env.MONGO_URI, { bufferCommands: false, dbName: "ticketingDB" }).then((mongoose) => {
            console.log('connected to mongo db')
            return mongoose
        }).catch(err => {
            console.error('Error connecting to mongo db:', err)
            cached.promise = null
            throw err
        })
    }

    try {
        cached.conn = await cached.promise
        console.log('creating a new     connection')
    } catch (err) {
        console.error('Error awaiting mongo db connection:', err)
        cached.promise = null
        throw err
    }

    return cached.conn
}
