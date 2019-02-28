module.exports = {
    passwords: {
        redisHost: process.env.REDIS_HOST,
        redisPort: process.env.REDIS_PORT
    },
    channels: {
        NEW: "NEW_VALUE",
        SEARCH: "SEARCH",
        DELETE: "DELETE"
    }
};
