const keys = require('./keys');
const {Pool} = require('pg');
const Config = require('./config');
const redis = require('redis');

// Set DB - Redis and Postgres
const pgClient = new Pool(Config.getPostgresConfig);
const redisClient = redis.createClient(Config.getRedisConfig);
pgClient.on('error', () => console.log('Lost PG connection'));
pgClient
    .query('CREATE TABLE IF NOT EXISTS TEAM_NAMES (name TEXT )')
    .catch(err => console.log(err));
const redisPublisher = redisClient.duplicate();

/**
 * Dispatches calls from client to right method
 * @param action
 * @param payload
 */
function init(action, payload) {
    const APIs = {
        getPearlByUserName: getPearlByUserName,
        getAllSearchedValues: getAllSearchedValues,
        deleteAllValues: deleteAllValues

    }

    APIs[action] ? APIs[action].apply(this, [action, payload]) : this.client.send(getResponseObject(400, null, null));
}

function getPearlByUserName(client, payload) {
    this.client.emit('searchResult', getResponseObject(200, 1, null));
    redisPublisher.publish('search', payload.username); // fires a search event which will be handled by worker service
    pgClient.query('INSERT INTO TEAM_NAMES(name) VALUES($1)', [payload.username]); // updates people user already
    // looked for

    redisClient.hgetall('values', (err, values) => {
        if (values && values[payload.username]) {
            this.client.emit('searchResult', getResponseObject(200, 0, values[payload.username]));
        } else {
            this.client.emit('searchResult', getResponseObject(400, 1, "Not Found"));
        }
    });
}

function getAllSearchedValues() {
    this.client.emit('allValues', getResponseObject(200, 1, []));
    pgClient.query('SELECT * from TEAM_NAMES ', (values) => {
        if (values) {
            this.client.emit('allValues', getResponseObject(200, 0, values));
        } else {
            this.client.emit('allValues', getResponseObject(200, 0, []));
        }
    });
}

function deleteAllValues() {
    pgClient.query('DELETE FROM TEAM_NAMES');
    redisClient.flushdb();
    this.client.emit('deletedAllValues',getResponseObject(200, 0, "All values were deleted, both from PG and Redis"));
}

/**
 *
 * @param resultCode - 200 success ( both completeted and pending ) while 400 for bad request
 * @param status - 1 completed , 0 pending
 * @param message - any string
 * @returns {{resultCode: *, message: *, status: *}}
 */
function getResponseObject(resultCode, isWorking, message = null) {
    return {resultCode: resultCode, isWorking: isWorking, message, message}
}

/*
app.post('/values', async (req, res) => {
    res.send({working: true});
    const userInput = req.body.userInput;
    redisPublisher.publish('insert', userInput);
    pgClient.query('INSERT INTO TEAM_NAMES(name) VALUES($1)', [userInput]);
});*/

module.exports = function (client) {
    this.client = client;
    this.dispatch = init
};
