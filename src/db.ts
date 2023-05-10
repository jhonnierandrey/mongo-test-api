import { MongoClient } from "mongodb";

let dbConnection;

type dbObject = {
    connectToDb: (cb: any) => void,
    getDb: () => {}
}

export const db = {
    connectToDb: (cb) => {
        MongoClient.connect(process.env.MONGODB_URL)
            .then((client) => {
                dbConnection = client.db()
                return cb()
            })
            .catch(err => {
                console.log(err);
                return cb(err);
            })
    },
    getDb: () => dbConnection,
}