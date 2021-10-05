// default app configuration
const port = process.env.PORT || 4000;
let db = process.env.MONGODB_URI || "mongodb://localhost:27017/nodegoat";

module.exports = {
    port,
    db,
    cookieSecret: "session_cookie_secret_key_here",
    cryptoAlgo: "aes-256-cbc",
    cryptoKey: "bf3c199c2470cb477d907b1e0917c17b",
    cryptoIv: "5183666c72eec9e4",
    hostName: "localhost",
    environmentalScripts: [],
    domain: 'http:localhost:4000' 
};

