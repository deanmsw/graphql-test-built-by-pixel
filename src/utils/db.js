const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seed = require('./seed');
dotenv.config();

mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.MONGO_URL, {
    autoIndex: true,
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
}

connection
    .then((db) => {
        console.log('🚀 Database connected');
        seed(db);
        return db;
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = connection;
