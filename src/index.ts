import { db } from './db.js';
import express from "express";

import dotenv from 'dotenv';

dotenv.config();

// init app & middleware
const app = express()

const port = process.env.PORT || 3000;

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
    let books = []
    // .find() cursor toArray forEach
    dbSuccess.collection('books')
        .find()
        .sort({ author: 1 })
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(err => {
            res.status(500).json({ error: "Could not fetch the document" });
        })
})