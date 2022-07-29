const { MongoClient } = require('mongodb');

// Create a new MongoClient
const client = new MongoClient(
    'mongodb://localhost:27017/horizon-compliance?poolSize=20&writeConcern=majority'
);

async function run() {
    // Connect the client to the server
    const db = await client.connect();

    console.log('Connected successfully to server');
    return db;
}

export default run;
