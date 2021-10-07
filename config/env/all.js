// default app configuration
require('dotenv').config();

const port = process.env.PORT || 4000;
let db = process.env.MONGODB_URI || "mongodb://localhost:27017/nodegoat";
const cookieSecret = process.env.COOKIE_SECRET;
const cryptoAlgo =  process.env.CRYPTO_ALGO;
const cryptoKey =  process.env.CRYPTO_KEY;
const cryptoIv = process.env.CRYPTO_IV;
const hostName = process.env.HOST_NAME ||  "localhost";
const environmentalScripts = [];
const domain = process.env.DOMAIN || 'http://localhost:4000';

module.exports = {
    port,
    db,
    cookieSecret,
    cryptoAlgo,
    cryptoKey,
    cryptoIv,
    hostName,
    environmentalScripts,
    domain,
};
