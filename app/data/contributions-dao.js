const { UserDAO } = require("./user-dao");
const Contribution = require('../schemas/Contribution');
const { ObjectId } = require('mongodb');

/* The ContributionsDAO must be constructed with a connected database object */
function ContributionsDAO() {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ContributionsDAO)) {
        console.log("Warning: ContributionsDAO constructor called without 'new' operator");
        return new ContributionsDAO();
    }

    /* const contributionsDB = db.collection("contributions"); */
    const userDAO = new UserDAO();

    this.update = async (userId, preTax, afterTax, roth) => {
        const parsedUserId = parseInt(userId);


        try {
            const user = await userDAO.getUserById(userId);
            // Create contributions document
            const contributions = {
                userId: user._id,
                preTax,
                afterTax,
                roth
            };

            const contributionUpdated = await Contribution.updateOne(
                { userId: ObjectId(user._id) },
                contributions,
                { upsert: true }
            ).lean();

            if (contributionUpdated) {
                console.log("Updated allocations");
                const user = await userDAO.getUserById(userId);
                return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userId,
                    preTax,
                    afterTax,
                    roth,
                };
            }
        } catch (error) {
            console.log('There was an error to update contributions-data ', error);
        }
        /* err => {
            if (!err) {
                console.log("Updated contributions");
                // add user details
                userDAO.getUserById(parsedUserId, (err, user) => {

                    if (err) return callback(err, null);

                    contributions.userName = user.userName;
                    contributions.firstName = user.firstName;
                    contributions.lastName = user.lastName;
                    contributions.userId = userId;

                    return callback(null, contributions);
                });
            } else {
                return callback(err, null);
            }
        } */
    };

    this.getByUserId = async (userId) => {
        try {
            const user = await userDAO.getUserById(userId);

            let userContributions = await Contribution.findOne({ userId: user._id }).exec();
            /* (err, contributions) => { */
            /* if (err) return callback(err, null); */

            // Set defualt contributions if not set
            userContributions = userContributions || {
                preTax: 2,
                afterTax: 2,
                roth: 2
            };

            // add user details

            /* if (err) return callback(err, null); */
            userContributions.firstName = user.firstName;
            userContributions.lastName = user.lastName;

            return userContributions;

            /* } */
        } catch (error) {
            console.log('error to getUserById contributions-dao', error);
        }
    };
}

module.exports = { ContributionsDAO };
