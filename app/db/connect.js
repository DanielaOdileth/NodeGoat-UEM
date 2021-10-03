const mongoose = require('mongoose');
mongoose.connect("mongodb://mongo:27017/nodegoat");
const logger = require('../utils/logger');

mongoose.connection.on("connected", (err, res) => {
    logger.info("mongoose db is connected");
});

mongoose.connection.on("error", err => {
    logger.error(`err on the mongoose db connection ${err}`)
});