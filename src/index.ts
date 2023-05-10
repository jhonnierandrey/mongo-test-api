import { db } from './db.js';
import express from "express";

import dotenv from 'dotenv';

dotenv.config();

// init app & middleware
const app = express()

const port = process.env.PORT || 3000;

console.log(port)

// db connection

const { connectToDb, getDb } = db;

let dbSuccess;

connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`app listening on port ${port}!`);
        });
        dbSuccess = getDb();
    }
})

// routes
app.get('/books', (req, res) => {
    res.json({ msg: 'welcome to the api, please provide your API key' })
    console.log(dbSuccess);
})