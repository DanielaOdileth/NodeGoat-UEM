"use strict";

const express = require("express");
const favicon = require("serve-favicon");
const csrf = require('csurf')
const session = require("express-session");
const consolidate = require("consolidate"); // Templating library adapter for Express
const swig = require("swig");
const helmet = require("helmet");

const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const cookieParser = require('cookie-parser')
const marked = require("marked");
const fs = require("fs");
const https = require("https");
const path = require("path");
const logger = require('./app/utils/logger');

//const nosniff = require('dont-sniff-mimetype');
const routes = require("./app/routes");
const { port, db, cookieSecret } = require("./config/config"); // Application config properties

const httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, "./artifacts/cert/server.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "./artifacts/cert/server.crt"))
};

mongoose.connect(db, (err, db) => {
    if (err) {
        logger.error(`Error: DB: connect: ${err}`);
        process.exit(1);
    }
    logger.info(`Connected to the database`);

    const app = express();

    app.use((req, res, next) => {
        res.removeHeader("X-Powered-By");
        next();
    });
    app.use(helmet());

    // Adding/ remove HTTP Headers for security
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: '16mb' }));
    app.use(compression())

    app.use(cors());
    app.use(favicon(__dirname + "/app/assets/favicon.ico"));

    // Express middleware to populate "req.body" so we can access POST variables
    /* app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        // Mandatory in Express v4
        extended: false
    })); */

    // Enable session management using express middleware
    app.use(session({
        secret: cookieSecret,
        name: "sessionId",
        key: "sessionId",
        cookie: {
            secure: true,
            httpOnly: true,
            sameSite: true,
            maxAge: 600000
        },
        saveUninitialized: true,
        resave: true
    }));

    app.use(csrf());

    // Register templating engine
    app.engine(".html", consolidate.swig);
    app.set("view engine", "html");
    app.set("views", `${__dirname}/app/views`);
    app.use(express.static(`${__dirname}/app/assets`));

    app.use((req, res, next) => {
        const token = req.csrfToken();
        res.cookie('XSRF-TOKEN', token);
        res.locals.csrfToken = token;
        res.locals.token = req.session._csrf;
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
        next();
    });
    /* app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
        res.locals.csrftoken = req.csrfToken();
        next();
    }) */

    // Initializing marked library
    // Fix for A9 - Insecure Dependencies
    marked.setOptions({
        sanitize: true
    });
    app.locals.marked = marked;

    // Application routes
    routes(app, db);

    // Template system setup
    swig.setDefaults({
        // Autoescape disabled
        // autoescape: false
        // Fix for A3 - XSS, enable auto escaping
        autoescape: true // default value
    });

    // Insecure HTTP connection
    /* http.createServer(app).listen(port, () => {
        console.log(`Express http server listening on port ${port}`);
    }); */
    /* app.listen(4000, () => {
        console.log(`Express http server listening on port ${port}`);
    }) */


    // Fix for A6-Sensitive Data Exposure
    // Use secure HTTPS protocol
    https.createServer(httpsOptions, app).listen(port, () => {
        logger.info(`Express http server listening on port ${port}`);
    });


});
