const channels = require('./keys').channels;

const {Pool} = require('pg');
const Config = require('./config');
const redis = require('redis');

// setting redis pub/sub architecture

const redisClient = redis.createClient(Config.getRedisConfig);
const subscriber = redis.createClient(Config.getRedisConfig);
const publisher = redis.createClient(Config.getRedisConfig);

subscriber.subscribe(channels.NEW);
subscriber.subscribe(channels.SEARCH);

subscriber.on("message", function (channel, message) {
    if (channels.NEW) {
        if (message) {
            this.client.emit('newValue', getResponseObject(200, 0, "Value was Added successfully"));
        }
    }

    if (channels.SEARCH) {

    }

    if (channels.DELETE) {

    }

    console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
});

// Set DB - Redis and Postgres
const pgClient = new Pool(Config.getPostgresConfig);
pgClient.on('error', () => console.log('Lost PG connection'));
pgClient
    .query('CREATE TABLE IF NOT EXISTS TEAM_NAMES (name TEXT )')
    .catch(err => console.log(err));

/**
 * Dispatches calls from client to right method
 * @param action
 * @param payload
 */
function init(action, payload) {
    const APIs = {
        [channels.SEARCH]: getPearlByUserName,
        [channels.SEARCH_ALL]: getAllSearchedValues,
        [channels.DELETE]: deleteAllValues,
        [channels.NEW]: addValues
    };

    APIs[action] ? APIs[action].call(this, payload) : this.client.send(getResponseObject(400, null, null));
}

function getPearlByUserName(payload) {
    this.client.emit(channels.SEARCH, getResponseObject(200, 1, null));
    publisher.publish(channels.SEARCH, payload.username); // fires a search event which will be handled by worker
                                                                // service
    pgClient.query('INSERT INTO TEAM_NAMES(name) VALUES($1)', [payload.username]); // updates people user already
    // looked for
}

function getAllSearchedValues() {
    this.client.emit(channels.SEARCH, getResponseObject(200, 1, []));
    pgClient.query('SELECT * from TEAM_NAMES ', (values) => {
        if (values) {
            this.client.emit(channels.SEARCH, getResponseObject(200, 0, values));
        } else {
            this.client.emit(channels.SEARCH, getResponseObject(200, 0, []));
        }
    });
}

function deleteAllValues() {
    pgClient.query('DELETE FROM TEAM_NAMES');
    publisher.flushdb();
    subscriber.flushdb();
    this.client.emit(channels.DELETE, getResponseObject(200, 0, "All values were deleted, both from PG and Redis"));
}

function addValues(payload) {
    this.client.emit(channels.NEW, getResponseObject(200, 1, null));

    // double check to UI validation
    payload.name = payload && payload.name.replace("/[^a-zA-Z0-9]/g,'_'"); // prevent SQL injection.
    payload.pearl = payload && payload.pearl.replace("/[^a-zA-Z0-9]/g,'_'"); // prevent SQL injection.

    pgClient.query('INSERT INTO TEAM_NAMES(name) VALUES($1)', [payload.name]);
    publisher.publish(channels.NEW, JSON.stringify(payload));

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
