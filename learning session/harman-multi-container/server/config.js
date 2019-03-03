const keys = require('./keys');

module.exports = {
    getPostgresConfig: getPostgresConfig(),
    getRedisConfig: getRedisConfig()
}

function getPostgresConfig() {
    return {
        user: keys.pgUser,
        host: keys.pgHost,
        database: keys.pgDatabase,
        password: keys.pgPassword,
        port: keys.pgPort
    }
}

function getRedisConfig() {
    return {
        host: keys.redisHost,
        port: keys.redisPort,
        retry_strategy: () => 1000
    }
}
