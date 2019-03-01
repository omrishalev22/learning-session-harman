/** SWAGGER =)
 * NEW - add new user and pearl
 * SEARCH - look for a pearl by username
 * SEARCH_ALL - get all names user already looked for
 * DELETE - delete redis in memory values
 */
module.exports = {
    channels: {
        NEW: "NEW",
        SEARCH: "SEARCH",
        SEARCH_ALL: "SEARCH_ALL",
        DELETE: "DELETE"
    }
};
