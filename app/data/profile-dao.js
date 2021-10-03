/* The ProfileDAO must be constructed with a connected database object */
const { UserDAO } = require("./user-dao");
const User = require('../schemas/User');
const crypto = require("crypto");
const config = require("../../config/config");
const logger = require('../utils/logger');

function ProfileDAO() {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ProfileDAO)) {
        logger.warn("Warning: ProfileDAO constructor called without 'new' operator");
        return new ProfileDAO();
    }

    const userDAO = new UserDAO();

    // Fix for A6 - Sensitive Data Exposure
    // Helper methods to encryt / decrypt
    const encrypt = (toEncrypt) => {
        const cipher = crypto.createCipheriv(config.cryptoAlgo, config.cryptoKey, config.cryptoIv);
        return `${cipher.update(toEncrypt, "utf8", "hex")}${cipher.final("hex")}`;
    };

    const decrypt = (toDecrypt) => {
        const decipher = crypto.createDecipheriv(config.cryptoAlgo, config.cryptoKey, config.cryptoIv);
        return `${decipher.update(toDecrypt, "hex", "utf8")}${decipher.final("utf8")}`;
    };

    this.updateUser = ({ userId, firstName, lastName, ssn, dob, address, website, bankAcc, bankRouting }) => {

        // Create user document
        const user = {};
        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (address) {
            user.address = encrypt(address);
        }
        if (bankAcc) {
            user.bankAcc = encrypt(bankAcc);
        }
        if (bankRouting) {
            user.bankRouting = encrypt(bankRouting);
        }
        if (ssn) {
            user.ssn = encrypt(ssn);
        }
        if (dob) {
            user.dob = dob;
        }
        if (dob) {
            user.website = website;
        }
        return User.updateOne({ userId: userId }, { $set: user }).exec();
    };

    this.getByUserId = async (userId) => {
        try {

            const user = await userDAO.getUserById(userId);
            user.ssn = user.ssn ? decrypt(user.ssn) : "";
            user.bankRouting = user.bankRouting ? decrypt(user.bankRouting) : "";
            user.bankAcc = user.bankAcc ? decrypt(user.bankAcc) : "";
            user.address = user.address ? decrypt(user.address) : "";
            return user;
        } catch (error) {
            logger.error('there was an error to getByUserId', error);
            return error
        }
    };
}

module.exports = { ProfileDAO };
