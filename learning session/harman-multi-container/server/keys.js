// Server keys
module.exports = {
  passwords:{
      redisHost: process.env.REDIS_HOST,
      redisPort: process.env.REDIS_PORT,
      pgUser: process.env.PGUSER,
      pgHost: process.env.PGHOST,
      pgDatabase: process.env.PGDATABASE,
      pgPassword: process.env.PGPASSWORD,
      pgPort: process.env.PGPORT
  },
  channels: {
      NEW: "NEW",
      NEW_RES: "NEW_RES",
      SEARCH: "SEARCH",
      SEARCH_RES: "SEARCH_RES",
      SEARCH_ALL: "SEARCH_ALL",
      SEARCH_ALL_RES: "SEARCH_ALL_RES",
      DELETE: "DELETE",
      DELETE_RES: "DELETE_RES"
  }

};
