const mongoDbService = require('./mongoDbService');
const env = process.env;

/**
 * Create mongoDbService instance configured to connect to food delivery database
 */
module.exports = mongoDbService({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    dbName: env.DB_NAME,
});
