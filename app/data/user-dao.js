const bcrypt = require("bcrypt-nodejs");
const User = require('../schemas/User');
const uuid = require('../../helper/uuid');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');

/* The UserDAO must be constructed with a connected database object */
function UserDAO() {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof UserDAO)) {
        console.log("Warning: UserDAO constructor called without 'new' operator");
        return new UserDAO();
    }

    /* const usersCol = db.collection("users"); */

    this.addUser = (userName, firstName, lastName, password, email) => {

        // Create user document
        const user = {
            username: userName,
            userId: uuidv4(),
            firstName,
            lastName,
            benefitStartDate: this.getRandomFutureDate(),
            password //received from request param
            /*
            // Fix for A2-1 - Broken Auth
            // Stores password  in a safer way using one way encryption and salt hashing
            password: bcrypt.hashSync(password, bcrypt.genSaltSync())
            */
        };

        // Add email if set
        if (email) {
            user.email = email;
        }

        const newUser = new User(user);
        return newUser.save();

        /* this.getNextSequence("userId", (err, id) => {
            if (err) {
                return callback(err, null);
            }
            console.log(typeof(id));

            user._id = id;
            usersCol.insert(user, (err, result) => !err ? callback(null, result.ops[0]) : callback(err, null));
        }); */
    };

    this.getRandomFutureDate = () => {
        /* const today = new Date();
        const day = (Math.floor(Math.random() * 10) + today.getDay()) % 29;
        const month = (Math.floor(Math.random() * 10) + today.getMonth()) % 12;
        const year = Math.ceil(Math.random() * 30) + today.getFullYear();
        return `${year}-${("0" + month).slice(-2)}-${("0" + day).slice(-2)}` */
        return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
    };

    this.validateLogin = async (userName, password) => {

        // Helper function to compare passwords
        /* const comparePassword = (fromDB, fromUser) => {
            return fromDB === fromUser;
            
            // Fix for A2-Broken Auth
            // compares decrypted password stored in this.addUser()
            // return bcrypt.compareSync(fromDB, fromUser);
        } */

        // Callback to pass to MongoDB that validates a user document
        /* const validateUserDoc = (err, user) => {

            if (err) return callback(err, null);

            if (user) {
                if (comparePassword(password, user.password)) {
                    callback(null, user);
                } else {
                    const invalidPasswordError = new Error("Invalid password");
                    // Set an extra field so we can distinguish this from a db error
                    invalidPasswordError.invalidPassword = true;
                    callback(invalidPasswordError, null);
                }
            } else {
                const noSuchUserError = new Error("User: " + user + " does not exist");
                // Set an extra field so we can distinguish this from a db error
                noSuchUserError.noSuchUser = true;
                callback(noSuchUserError, null);
            }
        } */

        console.log('userName ---> ', userName);
        return User.findOne({
            username: userName,
            password,
        }).exec();
        /* usersCol.findOne({
            userName: userName
        }, validateUserDoc); */
    };

    // This is the good one, see the next function
    this.getUserById = (userId) => {
        console.log('userId --->', userId);
        return User.findOne({
            /*  _id: ObjectId(userId) */
            userId: userId
        }).exec();
    };

    this.getUserByUserName = (username) => {
        return User.findOne({ username }).exec();
    };

    /* this.getNextSequence = (name, callback) => {
        db.collection("counters").findAndModify({
            _id: name
        }, [], {
            $inc: {
                seq: 1
            }
        }, {
            new: true
        },
            (err, data) => err ? callback(err, null) : callback(null, data.value.seq));
    }; */
}

module.exports = { UserDAO };
