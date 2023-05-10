import { db } from './db.js';
import express from "express";
import { ObjectId } from 'mongodb';

import dotenv from 'dotenv';

dotenv.config();

// init app & middleware
const app = express();
app.use(express.json());

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
    const page = Number(req.query.page) || 0;
    const booksPerPage = 3;
    let books = []

    // .find() cursor toArray forEach
    dbSuccess.collection('books')
        .find()
        .sort({ author: 1 })
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(err => {
            res.status(500).json({ error: "Could not fetch the document" });
        })
})

app.get('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        dbSuccess.collection('books')
            .findOne({ _id: new ObjectId(req.params.id) })
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => res.status(500).json({ error: 'Could not fetch the document.' }))
    } else {
        res.status(500).json({ error: "Not valid document id" })
    }
})

app.post('/books/', (req, res) => {
    const book = req.body

    dbSuccess.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({ error: "Could not create the new document" })
        })
})

app.delete('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        dbSuccess.collection('books')
            .deleteOne({ _id: new ObjectId(req.params.id) })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => res.status(500).json({ error: 'Could not delete the document.' }))
    } else {
        res.status(500).json({ error: "Not valid document id" })
    }
})

app.patch('/books/:id', (req, res) => {
    const updates = req.body

    if (ObjectId.isValid(req.params.id)) {
        dbSuccess.collection('books')
            .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => res.status(500).json({ error: 'Could not update the document.' }))
    } else {
        res.status(500).json({ error: "Not valid document id" })
    }
})