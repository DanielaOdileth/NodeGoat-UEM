const bcrypt = require("bcrypt-nodejs");
const User = require('../schemas/User');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const comparePassword = (fromDB, fromUser) => {
    return bcrypt.compareSync(fromDB, fromUser);;
}

const validateUserDoc = (user, password) => {

    if (user) {
        if (comparePassword(password, user.password)) {
            return user;
        } else {
            const invalidPasswordError = new Error("Invalid password");
            invalidPasswordError.invalidPassword = true;
            return;
        }
    } else {
        const noSuchUserError = new Error("User: " + user + " does not exist");
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
        logger.warn("Warning: UserDAO constructor called without 'new' operator");
        return new UserDAO();
    }

    this.addUser = (userName, firstName, lastName, password, email) => {
        logger.info(`Entering to add new user. username ${userName}`)
        const user = {
            username: userName,
            userId: uuidv4(),
            firstName,
            lastName,
            benefitStartDate: this.getRandomFutureDate(),
            password: bcrypt.hashSync(password, bcrypt.genSaltSync())
        };

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
        try {
            const user = await User.findOne({
                username: userName,
            }).exec();
            return validateUserDoc(user, password);
        } catch (error) {
            logger.error(`there was an erro to validateLogin. Error: ${error}`);
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

    this.blockUser = (userName) => {
        return User.updateOne({ username: userName }, { $set: { isEnabled: false } }).exec()
    };
}

module.exports = { UserDAO };
