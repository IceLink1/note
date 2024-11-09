const Query = require("./query");
const Mutation = require("./mutation");
const User = require("./user");
const Note = require("./note");

const resolvers = {
    Query,
    Mutation,
    User,
    Note,
    DateTime:null,
};

module.exports = resolvers