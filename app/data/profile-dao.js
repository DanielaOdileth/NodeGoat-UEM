/* The ProfileDAO must be constructed with a connected database object */
const { UserDAO } = require("./user-dao");
const User = require('../schemas/User');

function ProfileDAO() {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ProfileDAO)) {
        console.log("Warning: ProfileDAO constructor called without 'new' operator");
        return new ProfileDAO();
    }

    const userDAO = new UserDAO();
    /* const users = db.collection("users"); */

    /* Fix for A6 - Sensitive Data Exposure

    // Use crypto module to save sensitive data such as ssn, dob in encrypted format
    const crypto = require("crypto");
    const config = require("../../config/config");

    /// Helper method create initialization vector
    // By default the initialization vector is not secure enough, so we create our own
    const createIV = () => {
        // create a random salt for the PBKDF2 function - 16 bytes is the minimum length according to NIST
        const salt = crypto.randomBytes(16);
        return crypto.pbkdf2Sync(config.cryptoKey, salt, 100000, 512, "sha512");
    };

    // Helper methods to encryt / decrypt
    const encrypt = (toEncrypt) => {
        config.iv = createIV();
        const cipher = crypto.createCipheriv(config.cryptoAlgo, config.cryptoKey, config.iv);
        return `${cipher.update(toEncrypt, "utf8", "hex")} ${cipher.final("hex")}`;
    };

    const decrypt = (toDecrypt) => {
        const decipher = crypto.createDecipheriv(config.cryptoAlgo, config.cryptoKey, config.iv);
        return `${decipher.update(toDecrypt, "hex", "utf8")} ${decipher.final("utf8")}`;
    };
    */

    this.updateUser = (userId, firstName, lastName, ssn, dob, address, bankAcc, bankRouting) => {

        // Create user document
        const user = {};
        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (address) {
            user.address = new Date(address);
        }
        if (bankAcc) {
            user.bankAcc = bankAcc;
        }
        if (bankRouting) {
            user.bankRouting = bankRouting;
        }
        if (ssn) {
            user.ssn = ssn;
        }
        if (dob) {
            user.dob = dob;
        }
        /*
        // Fix for A7 - Sensitive Data Exposure
        // Store encrypted ssn and DOB
        if(ssn) {
            user.ssn = encrypt(ssn);
        }
        if(dob) {
            user.dob = encrypt(dob);
        }
        */

        return User.updateOne({ userId: userId }, { $set: user }).exec();
    };

    this.getByUserId = (userId) => {
        return userDAO.getUserById(userId);
    };
}

module.exports = { ProfileDAO };
