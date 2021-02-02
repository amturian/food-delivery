const mongodb = require('mongodb');

function mongodbService(params) {
    const {host, user, password, dbName} = params;

    /**
     * Promise that resolves to a MongoClient
     * Used for keeping db client connection state
     * @type {Promise|null}
     */
    let clientPromise = null;
    /**
     * Counter for how many times the singleton db connection is called
     * @type {number}
     */
    let noOfCalls = 0;

    return {
        getDb,
    };

    /**
     * Connect to the mongo server and return a new MongoClient
     * @return {Promise<mongodb.MongoClient>} - promise that resolves to database client or rejects with error message on failure
     */
    function getClient() {
        console.log('Creating a new mongo client...');
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
            .then(client => {
                console.info('Connected.');
                return client;
            })
            .catch(err => {
                console.error('Failed to connect', err);
                throw err;
            });
    }

    /**
     * Initiate, retrieve or refresh a database connection
     * @param {string} [name=process.env.DB_NAME] - database name
     * @returns {Promise<mongodb.Db>} - promise that resolves to mongo database object
     */
    async function getDb(name) {
        noOfCalls++; // used to count how many times our singleton is called.
        console.log(`Singleton db connection called ${noOfCalls} times`);

        // no connection exists or existing connection is stale
        if (!clientPromise || !(await clientPromise).isConnected()) {
            clientPromise = getClient().catch(err => {
                clientPromise = null;
                throw err;
            });
        }

        return (await clientPromise).db(name || dbName);
    }
}

module.exports = mongodbService;