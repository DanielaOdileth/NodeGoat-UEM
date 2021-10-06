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
const marked = require("marked");
const MongoStore = require('connect-mongo');
const logger = require('./app/utils/logger');

const routes = require("./app/routes");
const { port, db: dbUri, cookieSecret, domain } = require("./config/config"); // Application config properties

mongoose.connect(dbUri, (err, db) => {
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

    // Enable session management using express middleware
    app.use(session({
        secret: cookieSecret,
        name: "session-token",
        cookie: {
            httpOnly: true,
            sameSite: true,
            maxAge: 600000,
            secure: process.env.NODE_ENV !== "development"
        },
        store: MongoStore.create({ mongoUrl: dbUri }),
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
        res.cookie('XSRF-TOKEN', token, { sameSite: true, httpOnly: true });
        res.locals.csrfToken = token;
        res.locals.token = req.session._csrf;
        res.setHeader('Access-Control-Allow-Origin', domain);
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        next();
    });

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
        autoescape: true // default value
    });

    app.listen(port, () => {
        console.log(`Express http server listening on port ${port}`);
    })
});
