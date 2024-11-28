const express = require('express');
const { connectToDb, getDb } = require('./db');

// init the app && middleware
const app = express();

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
            res.status(500).json({ error: "Could not fetch the data!" });
        });
});
