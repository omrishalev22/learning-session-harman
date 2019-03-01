const Dispatcher = function (websocket) {
    const keys = require('./keys');
    const {Pool} = require('pg');
    const Config = require('./config');

    // setting redis pub/sub architecture
    const redis = require('redis');
    const subscriber = redis.createClient(Config.getRedisConfig);
    const publisher = redis.createClient(Config.getRedisConfig);
    const pgClient = new Pool(Config.getPostgresConfig);

    let client = null;

    class Dispatcher {

        constructor(websocket) {
            client = websocket;
            this.initConfiguration();
            this.initListeners();
            this.dispatch = this.init; // for outside usage
        }

        /**
         * Dispatches calls from client to right method
         * @param action
         * @param payload
         */
        init(action, payload) {
            const APIs = {
                SEARCH: this.getPearlByUserName,
                SEARCH_ALL: this.getAllSearchedValues,
                DELETE: this.deleteAllValues
            }

            /*NEW: this.addValues*/

            APIs[action] ? APIs[action].call(this, payload) : client.send(this.getResponseObject(400, null, null));
        }

        initListeners() {
            subscriber.on("message", (channel, message) => {
                if (channel === keys.channels.SEARCH_RES) {
                    if (message) {
                        client.emit(keys.channels.SEARCH, this.getResponseObject(200, 0, message));
                    } else {
                        client.emit(keys.channels.SEARCH, this.getResponseObject(400, 1, "Not Found"));
                    }
                }

                if (channel === keys.channels.SEARCH_ALL) {

                }
            });
        }

        /**
         * Init redis and postgres configuration
         */
        initConfiguration() {
            subscriber.subscribe("newValues");
            subscriber.subscribe(keys.channels.SEARCH_RES);

            pgClient.on('error', () => console.log('Lost PG connection'));
            pgClient
                .query('CREATE TABLE IF NOT EXISTS TEAM_NAMES (name TEXT )')
                .catch(err => console.log(err));

        }

        /**************** APIs ****************/

        getPearlByUserName(payload) {
            client.emit(keys.channels.SEARCH, this.getResponseObject(200, 1, null));
            publisher.publish(keys.channels.SEARCH, payload.username); // fires a search event which will be handled by worker service
            pgClient.query('INSERT INTO TEAM_NAMES(name) VALUES($1)', [payload.username]); // updates people user already
            // looked for
        }

        getAllSearchedValues() {
            client.emit(keys.channels.SEARCH_ALL, this.getResponseObject(200, 1, []));
            pgClient.query('SELECT * from TEAM_NAMES ', (values) => {
                if (values) {
                    client.emit(keys.channels.SEARCH_ALL, this.getResponseObject(200, 0, values));
                } else {
                    client.emit(keys.channels.SEARCH_ALL, this.getResponseObject(200, 0, []));
                }
            });
        }

        deleteAllValues() {
            pgClient.query('DELETE FROM TEAM_NAMES');
            client.emit(keys.channels.DELETE, this.getResponseObject(200, 0, "All values were deleted, both from PG and Redis"));
        }


  /*      addValues(payload) {
            console.log("add new values started by accident");
            client.emit('newValue', this.getResponseObject(200, 1, null));

            // double check to UI validation
            payload.name = payload && payload.name.replace("/[^a-zA-Z0-9]/g,'_'"); // prevent SQL injection.
            payload.pearl = payload && payload.pearl.replace("/[^a-zA-Z0-9]/g,'_'"); // prevent SQL injection.

            pgClient.query('INSERT INTO TEAM_NAMES(name) VALUES($1)', [payload.name]);
            publisher.publish('insert', JSON.stringify(payload));

        }*/


        /****************** APIs - END ****************/


        /******************* HELPERS ****************/

        /**
         *
         * @param resultCode - 200 success ( both completeted and pending ) while 400 for bad request
         * @param status - 1 completed , 0 pending
         * @param message - any string
         * @returns {{resultCode: *, message: *, status: *}}
         */
        getResponseObject(resultCode, isWorking, message = null) {
            return {resultCode: resultCode, isWorking: isWorking, message}
        }


        /******************* HELPERS END ****************/


    }

    return new Dispatcher(websocket);
}

module.exports = function (websocket) {
    return new Dispatcher(websocket);
}



