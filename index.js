const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');
const { mongoose } = require('./DataBase/database');

const app = express();
const ServerPort = 4000;

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(ServerPort, () => {
    console.log(`The Server is now listening on port ${ServerPort}`);
});