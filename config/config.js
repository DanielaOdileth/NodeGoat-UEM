const _ = require("underscore");
const path = require("path");
const util = require('util');
const logger = require('../app/utils/logger');

const finalEnv = process.env.NODE_ENV || "development";

const allConf = require(path.resolve(__dirname + "/../config/env/all.js"))
const envConf = require(path.resolve(__dirname + "/../config/env/" + finalEnv.toLowerCase() + ".js")) || {}

const config = { ...allConf, ...envConf }

logger.info(`Current Config:`)
logger.info(util.inspect(config, false, null))

module.exports = config;
