/* const mongoose = require('mongoose');
mongoose.connect("mongodb://mongo:27017/nodegoat")
.then(()=> console.log('DB connected from db-reset!'))
.catch((err)=> console.log('err to connect the db from db-reset ', err)); */

const mongoose = require('mongoose');
mongoose.connect("mongodb://mongo:27017/nodegoat");
mongoose.connection.on("connected", (err, res) => {
    console.log("*** mongoose is connected ***")
});

mongoose.connection.on("error", err => {
    console.log("err", err)
});

/* mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
    //trying to get collection names
    mongoose.connection.db.listCollections().forEach(collection => {
        console.log('collection ---> ', collection);
    })
}) */
