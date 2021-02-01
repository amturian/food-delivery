const mongodbService = require('./mongodbService');
const env = process.env;

/**
 * Creates an instance of a mongodbService with the client
 * configured to connect to food delivery database.
 */
module.exports = mongodbService({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    dbName: env.DB_NAME,
});
