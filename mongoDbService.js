const mongodb = require('mongodb');
const connectionString = "mongodb+srv://alexandra:alexandra@cluster0.bkvgn.mongodb.net/test?retryWrites=true&w=majority";
const dbName = 'food-delivery';

/**
 * A captured promise that resolves to a MongoClient
 * Used for keeping connection state
 * @type {Promise|null}
 */
let clientPromise = null;
let instance = 0;

/**
 * Connects to the mongo server and returns a new MongoClient.
 * @return {Promise<mongodb.MongoClient>} - Resolves to database client, or rejects with error message on failure
 */
function getNewClient() {
    console.log('Getting new mongo client...');
    console.log('Connecting to mongo server:', connectionString);
    let options = {
        auth: {
            user: 'alexandra',
            password: 'alexandra',
        },
        useUnifiedTopology: true,
        useNewUrlParser: true,
    };

    return mongodb.MongoClient.connect(connectionString, options)
        .then(conn => {
            console.info('Connected.');
            return conn;
        })
        .catch(err => {
            console.error('Connection failed:', err);
            throw err;
        });
}

/**
 * Initiates, retrieves, or refreshes a database connection.
 * @param {string} [name=process.env.<connId>_DB_NAME] - optional database name to connect to
 * @returns {Promise<mongodb.Db>} - Resolves to a mongo database object
 */
async function getDb(name) {
    instance++; // used to count how many times our singleton is called.
    console.log(`Singleton db connection called ${instance} times`);

    // no connection exists or existing connection is stale
    if (!clientPromise || !(await clientPromise).isConnected()) {
        clientPromise = getNewClient().catch(err => {
            clientPromise = null;
            throw err;
        });
    }
    return (await clientPromise).db(name || dbName);
}

module.exports = {
    getDb,
}