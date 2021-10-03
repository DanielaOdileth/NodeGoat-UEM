const bcrypt = require("bcrypt-nodejs");
const User = require('../schemas/User');
const { v4: uuidv4 } = require('uuid');

const comparePassword = (fromDB, fromUser) => {
    return bcrypt.compareSync(fromDB, fromUser);;
}

const validateUserDoc = (user, password) => {

    if (user) {
        if (comparePassword(password, user.password)) {
            return user;
        } else {
            const invalidPasswordError = new Error("Invalid password");
            // Set an extra field so we can distinguish this from a db error
            invalidPasswordError.invalidPassword = true;
            return;
        }
    } else {     
        const noSuchUserError = new Error("User: " + user + " does not exist");
        // Set an extra field so we can distinguish this from a db error
        noSuchUserError.noSuchUser = true;
        return;
    }
}

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
            password: bcrypt.hashSync(password, bcrypt.genSaltSync()) //received from request param
        };

        // Add email if set
        if (email) {
            user.email = email;
        }

        const newUser = new User(user);
        return newUser.save();
    };

    this.getRandomFutureDate = () => {
        return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
    };

    this.validateLogin = async (userName, password) => {

        // Helper function to compare passwords
        // Callback to pass to MongoDB that validates a user document
        try {
            const user = await User.findOne({
                username: userName,
            }).exec();
            return validateUserDoc(user, password);
        } catch (error) {
            console.log('there was an erro to validateLogin', error);
            return error;
        }
    };

    // This is the good one, see the next function
    this.getUserById = (userId) => {
        return User.findOne({
            userId: userId
        }).exec();
    };

    this.getUserByUserName = (username) => {
        return User.findOne({ username }).exec();
    };
}

module.exports = { UserDAO };
