const _ = require('lodash');
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
        insertOne,
        updateOne,
        getObjectId,
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
        console.log(`Singleton getDd method called ${noOfCalls} times`);

        // no connection exists or existing connection is stale
        if (!clientPromise || !(await clientPromise).isConnected()) {
            clientPromise = getClient().catch(err => {
                clientPromise = null;
                throw err;
            });
        }

        return (await clientPromise).db(name || dbName);
    }

    /**
     * Wrapper for mongodb insertOne() function
     * https://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html#insertOne
     * https://docs.mongodb.com/v3.4/reference/method/db.collection.insertOne
     * @param {string} collection
     * @param {object} doc
     * @param {object} [options={}] - https://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html#insertOne
     * @returns {Promise<object>} - promise that resolves to the inserted document
     */
    async function insertOne(collection, doc, options) {
        const db = await getDb();

        try {
            var result = await db.collection(collection).insertOne(
                {
                    _type: collection,
                    ...doc,
                },
                options
            );
        } catch (err) {
            console.error(err);
        }

        return makeBo(result.ops[0]);
    }

    async function updateOne(collection, query, content) {
        const db = await getDb();
        const validContent = removeReservedFields(content);
        if (_.isEmpty(validContent)) {
            throw new Error(`At least one ${collection} field must be specified for update`);
        }
        console.log('result', validContent, collection, query);

        try {
            var result = await db
                .collection(collection)
                .findOneAndUpdate(
                    query,
                    {$set: validContent},
                    {returnOriginal: false}
                );
        } catch (err) {
            console.error(err);
            throw new Error(`Failed to update ${collection}`);
        }

        if (!(result && result.lastErrorObject.updatedExisting)) {
            console.info(result);
            throw new Error(`${collection} not found`);
        }
        console.info(`Successfully updated ${collection}: ${result.value._id}`);

        return makeBo(result.value);
    }

    function removeReservedFields(document) {
        let {_id, _type, ...validDocument} = document;

        return validDocument;
    }

    /**
     * Converts id to ObjectId or throws error
     * @param {string} idString
     */
    function getObjectId(idString) {
        try {
            return mongodb.ObjectId(idString);
        } catch (err) {
            console.info(err.message);
            throw new Error(`Invalid id provided: ${idString}. ${err.message}`);
        }
    }


    /**
     * Convert first level database specific document attributes
     * @param result {object|cursor|array} - MongoDb document result/set
     * @param [options] {object}
     * @param [options.defaultTo] {*} - In case of empty result, dto should yield to given value
     * @returns {object|object[]|*}
     */
    function makeBo(result, options) {
        if (!result) {
            return options.hasOwnProperty('defaultTo') ? options.defaultTo : {};
        }

        let swapMongoIdProp = obj => {
            let objCopy = {...obj, id: obj['_id']};
            delete objCopy['_id'];
            return objCopy;
        };

        return Array.isArray(result)
            ? result.map(swapMongoIdProp)
            : swapMongoIdProp(result);
    }
}

module.exports = mongodbService;