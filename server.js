const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const foodDbService = require('./services/foodDbService');

app.use(bodyParser.json());

/**
 * Connect to databases and then start http server
 * In case of any error, exit
 * @returns {Promise<void>}
 */
async function start() {
    try {
        await foodDbService.getDb();
        // remove comments to see singleton pattern in action, no new clients should be created
        // await dbService.getDb();
        // await dbService.getDb();

        console.log('Starting http server...');
        app.listen(8999, function() {
            console.log('Server started. Listening on %j', 8999);
        });
    } catch(error) {
        console.error(error);
        process.exit(-1);
    }
}

start().then(() => console.log('Finished startup process.'));

app.use('/orders', require('./routes/orders'));

app.get('/', async (req, res) => {
    res.status(200).send('Hello from express server');
});

app.use(globalErrorHandler);

function globalErrorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).send({error: err.message});
}