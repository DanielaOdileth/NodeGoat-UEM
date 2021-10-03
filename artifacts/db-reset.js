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

const USERS_TO_INSERT = [
    {
        // "_id": 1,
        "userId": 'd1edd511-6ce9-4a12-b196-4fafb6b3b16f',
        "username": "admin",
        "firstName": "Node Goat",
        "lastName": "Admin",
        "password": bcrypt.hashSync("Admin_123", bcrypt.genSaltSync()),
        //"password": "$2a$10$8Zo/1e8KM8QzqOKqbDlYlONBOzukWXrM.IiyzqHRYDXqwB3gzDsba", // Admin_123
        "isAdmin": true
    }, {
        // "_id": 2,
        "userId": '40848bdb-7c04-40e2-8694-5513db705732',
        "username": "user1",
        "firstName": "John",
        "lastName": "Doe",
        "benefitStartDate": "2030-01-10",
        // "password": "User1_123"
        "password": bcrypt.hashSync("User1_123", bcrypt.genSaltSync()),
        //"password": "$2a$10$RNFhiNmt2TTpVO9cqZElb.LQM9e1mzDoggEHufLjAnAKImc6FNE86",// User1_123
    }, {
        // "_id": 3,
        "userId": '1258559b-c082-436c-8ecb-f74679954ffd',
        "username": "user2",
        "firstName": "Will",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        // "password": "User2_123"
        "password": bcrypt.hashSync("User2_123", bcrypt.genSaltSync()),
        //"password": "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }];

const tryDropCollection = (db, name) => {
    return new Promise((resolve, reject) => {
        db.dropCollection(name, (err, data) => {
            if (!err) {
                console.log(`Dropped collection: ${name}`);
            }
            resolve(undefined);
        });
    });
}

const parseResponse = (err, res, comm) => {
    if (err) {
        console.log("ERROR:");
        console.log(comm);
        console.log(JSON.stringify(err));
        process.exit(1);
    }
    console.log(comm);
    console.log(JSON.stringify(res));
}

console.log("******* db.reset *****");
const collections = mongoose.connections[0].collections;
const names = Object.keys(collections);

console.log("*** Dropping existing collections ***");

Promise.all([User.collection.drop(), Allocation.collection.drop(), Contribution.collection.drop()])
    .then(async () => {
        console.log('collections droped');
    }).catch(err => {
        if (err.codeName === "NamespaceNotFound") {
            console.warn('There is no collections on the db');
        } else {
            console.log('There was an error to drop the collections', err);
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
        /*  try {
             await Allocation.insertMany(allocations);
             console.log("Database reset performed successfully")
             process.exit(0);
         } catch (error) {
             console.log('There was an error to insert the data: ', error);
         } */
        Allocation.insertMany(allocations)
            .then(() => { 
                console.log("Database reset performed successfully")
                process.exit(0);
            });
    }).catch(error => {
        console.log('error to insertMany users', error);
        process.exit(1);
    });

// Starting here

// remove existing data (if any), we don't want to look for errors here  

/* MongoClient.connect(db, (err, db) =>  {
    if (err) {
        console.log("ERROR: connect");
        console.log(JSON.stringify(err));
        process.exit(1);
    }
    console.log("Connected to the database");

    const collectionNames = [
        "users",
        "allocations",
        "contributions",
        "memos",
        "counters"
    ];

    // remove existing data (if any), we don't want to look for errors here
    console.log("Dropping existing collections");
    const dropPromises = collectionNames.map((name) => tryDropCollection(db, name));

    // Wait for all drops to finish (or fail) before continuing
    Promise.all(dropPromises).then(() => {
        const usersCol = db.collection("users");
        const allocationsCol = db.collection("allocations");
        const countersCol = db.collection("counters");

        // reset unique id counter
        countersCol.insert({
            _id: "userId",
            seq: 3
        }, (err, data) => {
            parseResponse(err, data, "countersCol.insert");
        });

        // insert admin and test users
        console.log("Users to insert:");
        USERS_TO_INSERT.forEach((user) => console.log(JSON.stringify(user)));

        usersCol.insertMany(USERS_TO_INSERT, (err, data) => {
            const finalAllocations = [];

            // We can't continue if error here
            if (err) {
                console.log("ERROR: insertMany");
                console.log(JSON.stringify(err));
                process.exit(1);
            }
            parseResponse(err, data, "users.insertMany");

            data.ops.forEach((user) => {
                const stocks = Math.floor((Math.random() * 40) + 1);
                const funds = Math.floor((Math.random() * 40) + 1);

                finalAllocations.push({
                    userId: user._id,
                    stocks: stocks,
                    funds: funds,
                    bonds: 100 - (stocks + funds)
                });
            });

            console.log("Allocations to insert:");
            finalAllocations.forEach(allocation => console.log(JSON.stringify(allocation)));

            allocationsCol.insertMany(finalAllocations, (err, data) => {
                parseResponse(err, data, "allocations.insertMany");
                console.log("Database reset performed successfully")
                process.exit(0);
            });

        });
    });
}); */
