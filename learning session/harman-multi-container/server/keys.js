module.exports = {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    pgUser: process.env.PGUSER,
    pgHost: process.env.PGHOST,
    pgDatabase: process.env.PGDATABASE,
    pgPassword: process.env.PGPASSWORD,
    pgPort: process.env.PGPORT,
    channels: {
        SEARCH: "SEARCH",
        SEARCH_RES: "SEARCH_RES",
        SEARCH_ALL: "SEARCH_ALL",
        DELETE: "DELETE",
        ADD: "ADD",
        ADD_RES: "ADD_RES"
    }
};
