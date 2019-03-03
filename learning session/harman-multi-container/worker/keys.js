module.exports = {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    channels: {
        SEARCH: "SEARCH",
        SEARCH_RES: "SEARCH_RES",
        ADD: "ADD",
        ADD_RES: "ADD_RES"
    }
};
