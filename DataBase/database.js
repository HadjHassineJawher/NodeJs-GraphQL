const mongoose = require('mongoose');

/*  ---------------------- Data Base URL and Information  ---------------------- */

mongoose.connect('mongodb+srv://HadjHassineJawher:Jawher010698@graphqlapi.05ewl.mongodb.net/GraphqlMongoDB?retryWrites=true&w=majority',
    { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true },
    (err) => {
        if (!err)
            console.log(' Connection To GraphqlMongoDB DataBase Succeeded ');
        else
            console.log(' Error in DataBase Connection : ' + JSON.stringify(err, undefined, 2));
    });

// mongoose.connection.once('open', () => {
//     console.log('Connection To GraphqlMongoDB DataBase ');
// }); 

module.exports = mongoose;