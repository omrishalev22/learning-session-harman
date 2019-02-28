module.exports = {
    passwords: {
        redisHost: process.env.REDIS_HOST,
        redisPort: process.env.REDIS_PORT,
        pgUser: process.env.PGUSER,
        pgHost: process.env.PGHOST,
        pgDatabase: process.env.PGDATABASE,
        pgPassword: process.env.PGPASSWORD,
        pgPort: process.env.PGPORT
    },
    channels: {
        NEW: "NEW_VALUE",
        SEARCH: "SEARCH",
        SEARCH_ALL: "SEARCH_ALL",
        DELETE: "DELETE"
    }

};
