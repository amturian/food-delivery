const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const foodDbService = require('./foodDb');

app.use(bodyParser.json());

/**
 * Connects to databases and then starts http server
 * In case of any error, exits
 * @returns {Promise<void>}
 */
async function start() {
    try {
        await foodDbService.getDb();
        // remove comments to see singleton pattern in action
        // await dbService.getDb();
        // await dbService.getDb();

        console.log('Starting http server...');
        app.listen(8999, function() {
            console.log('Http server started. Listening on %j', 8999);
        });
    } catch(error) {
        console.error(error);
        process.exit(-1);
    }
}

start().then(() => console.log('Server initialized.'));

app.get('/', async (req, res) => {
    res.status(200).send('Hello from express server');
});
