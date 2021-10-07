"use strict";

const express = require("express");
const favicon = require("serve-favicon");
const csrf = require('csurf')
const session = require("express-session");
const consolidate = require("consolidate"); // Templating library adapter for Express
const swig = require("swig");
const helmet = require("helmet");
const contentSecurityPolicy = require("helmet-csp");
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

        const whitelistedSources = [ `${domain}`, "'unsafe-inline'", "unsafe-eval"];
    
        //  Helmet setup
        app.use(helmet.contentSecurityPolicy({
            useDefaults: false,
            directives: {
                'default-src': whitelistedSources,
                'script-src': whitelistedSources,
                'style-src': whitelistedSources,
                'font-src': whitelistedSources,
                'img-src': whitelistedSources
            },
        }));

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: '16mb' }));
    app.use(compression())

    app.use(cors({
        origin: domain,
    }));
    app.use(favicon(__dirname + "/app/assets/favicon.ico"));

    app.use(session({
        secret: cookieSecret,
        name: "session-token",
        cookie: {
            httpOnly: true,
            proxy: true,
            sameSite: true,
            maxAge: 600000,
            secure: process.env.NODE_ENV !== "development",
        },
        store: MongoStore.create({ mongoUrl: dbUri }),
        saveUninitialized: true,
        resave: true
    }));

    app.set('trust proxy', true)

    app.use(csrf());

    app.engine(".html", consolidate.swig);
    app.set("view engine", "html");
    app.set("views", `${__dirname}/app/views`);
    app.use(express.static(`${__dirname}/app/assets`));

    app.use((req, res, next) => {
        const token = req.csrfToken();
        res.cookie('XSRF-TOKEN', token, {
            sameSite: true,
            proxy: true,
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
        });
        res.locals.csrfToken = token;
        res.locals.token = req.session._csrf;
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
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
