const mongodb = require('mongodb');

function mongodbService(params) {
    const {host, user, password, dbName} = params;

    /**
     * A captured promise that resolves to a MongoClient
     * Used for keeping connection state
     * @type {Promise|null}
     */
    let clientPromise = null;
    /**
     * Variable used for counting how many times the singleton db connection is called
     * @type {number}
     */
    let instance = 0;

    // return object containing service methods
    return {
        getDb,
    };

    /**
     * Connects to the mongo server and returns a new MongoClient.
     * @return {Promise<mongodb.MongoClient>} - Resolves to database client, or rejects with error message on failure
     */
    function getNewClient() {
        console.log('Getting new mongo client...');
        console.log('Connecting to mongo server:', host);
        let options = {
            auth: {
                user,
                password,
            },
            useUnifiedTopology: true,
            useNewUrlParser: true,
        };

        return mongodb.MongoClient.connect(host, options)
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
}

module.exports = mongodbService;