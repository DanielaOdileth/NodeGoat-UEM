#!/usr/bin/env nodejs

"use strict";

// This script initializes the database. You can set the environment variable
// before running it (default: development). ie:
// NODE_ENV=production node artifacts/db-reset.js
/* const { MongoClient } = require("mongodb"); */
/* const { db } = require("../config/config"); */
const mongoose = require('mongoose');
const getCollectios = require('../app/db/connect');
const User = require('../app/schemas/User');
const Allocation = require('../app/schemas/Allocation');
const Contribution = require('../app/schemas/Contribution');
const bcrypt = require("bcrypt-nodejs");
const uuid = require('../helper/uuid');
const logger = require('../app/utils/logger');

const USERS_TO_INSERT = [
    {
        "userId": 'd1edd511-6ce9-4a12-b196-4fafb6b3b16f',
        "username": "admin",
        "firstName": "Node Goat",
        "lastName": "Admin",
        "password": bcrypt.hashSync("Admin_123", bcrypt.genSaltSync()),
        "isAdmin": true
    }, {
        "userId": '40848bdb-7c04-40e2-8694-5513db705732',
        "username": "user1",
        "firstName": "John",
        "lastName": "Doe",
        "benefitStartDate": "2030-01-10",
        "password": bcrypt.hashSync("User1_123", bcrypt.genSaltSync()),
    }, {
        "userId": '1258559b-c082-436c-8ecb-f74679954ffd',
        "username": "user2",
        "firstName": "Will",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": bcrypt.hashSync("User2_123", bcrypt.genSaltSync()),
    }];

const collections = mongoose.connections[0].collections;
const names = Object.keys(collections);

logger.debug(`Dropping existing collections ${names}`);

Promise.all([User.collection.drop(), Allocation.collection.drop(), Contribution.collection.drop()])
    .then(async () => {
        logger.info('collections droped');
    }).catch(err => {
        if (err.codeName === "NamespaceNotFound") {
            logger.warn('There is no collections on the db');
        } else {
            logger.error(`There was an error to drop the collections ${err}`);
        }
    })

User.insertMany(USERS_TO_INSERT)
    .then(async response => {
        // Adding key values to insert Allocations 
        const allocations = response.map(user => {
            const stocks = Math.floor((Math.random() * 40) + 1);
            const funds = Math.floor((Math.random() * 40) + 1);
            return {
                userId: user._id,
                stocks: stocks,
                funds: funds,
                bonds: 100 - (stocks + funds)
            };
        });
        Allocation.insertMany(allocations)
            .then(() => {
                logger.info("Database reset performed successfully")
                process.exit(0);
            });
    }).catch(error => {
        logger.error(`error to insertMany users: ${error}`);
        process.exit(1);
    });
