import { MongoClient } from "mongodb";

let dbConnection;

type dbObject = {
    connectToDb: (cb: any) => void,
    getDb: () => {}
}



export const db = {
    connectToDb: (cb) => {
        let uri = process.env.MONGODB_ATLAS_URL;
        MongoClient.connect(uri)
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