const express = require('express');
const { connectToDb, getDb } = require('./db');
const { ObjectId } = require('mongodb');

// init the app && middleware
const app = express();

app.use(express.json()); // When a client sends a request with a JSON payload (e.g., a POST or PUT request with a JSON body), express.json() parses that JSON data into a JavaScript object and makes it accessible via req.body.

let db;

// db connection
connectToDb((err) => {
    if (!err) {
        console.log('Connected to the database!');
        app.listen(3000, () => {
            console.log('App is running on port - 3000');
        });
        db = getDb();
    } else {
        console.error(err);
    }
});

// routes
app.get('/books', (req, res) => {
    if (!db) {
        return res.status(500).json({ error: "Database not initialized" });
    }

    const books = [];

    db.collection('books')
        .find()
        .sort({ author: 1 })
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books);
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: "Could not fetch the documents!" });
        });
});


app.get('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .findOne({ _id: new ObjectId(req.params.id) })
            .then((doc) => {
                res.status(200).json(doc)
            })
            .catch(() => {
                res.status(500).json({ error: "Could not fetch the document!" })
            })
    } else {
        res.status(500).json({ error: "Could not fetch the document!" })
    }
})

app.post('/books', (req, res) => {
    const book = req.body
    db.collection('books')
        .insertOne(book)
        .then((result) => {
            res.status(201).json(result)  // 201: successful creation
        })
        .catch(() => {
            res.status(500).json({error: "Could not create the document!"})
        })
})