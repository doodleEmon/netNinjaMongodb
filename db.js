const { MongoClient } = require('mongodb');

let dbConnection;

const connectToDb = (callback) => {
    MongoClient.connect('mongodb://localhost:27017') // Replace with your MongoDB URI
        .then(client => {
            dbConnection = client.db('bookStore'); // Replace 'bookStore' with your DB name
            return callback();
        })
        .catch(err => {
            console.error('Failed to connect to the database:', err);
            return callback(err);
        });
};

const getDb = () => {
    if (!dbConnection) {
        throw new Error('Database not initialized');
    }
    return dbConnection;
};

module.exports = { connectToDb, getDb };
