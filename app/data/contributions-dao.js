const { UserDAO } = require("./user-dao");
const Contribution = require('../schemas/Contribution');
const { ObjectId } = require('mongodb');
const logger = require('../utils/logger');

/* The ContributionsDAO must be constructed with a connected database object */
function ContributionsDAO() {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ContributionsDAO)) {
        logger.warn("Warning: ContributionsDAO constructor called without 'new' operator");
        return new ContributionsDAO();
    }

    /* const contributionsDB = db.collection("contributions"); */
    const userDAO = new UserDAO();

    this.update = async (userId, preTax, afterTax, roth) => {
        try {
            logger.info(`Entering to update contributions for userId ${userId}`)
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
                logger.info(`Updated allocations for user: ${userId}`);
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
            logger.error(`There was an error to update contributions-data ${error}`);
        }
    };

    this.getByUserId = async (userId) => {
        try {
            const user = await userDAO.getUserById(userId);
            let userContributions = {
                preTax: 2,
                afterTax: 2,
                roth: 2
            };

            let contributions = await Contribution.findOne({ userId: user._id }).exec();
            if (contributions) {
                const { preTax: userPT, afterTax: userAT, roth: userR } = contributions;
                userContributions = { preTax: userPT, afterTax: userAT, roth: userR }
            }

            userContributions.firstName = user.firstName;
            userContributions.lastName = user.lastName;

            return userContributions;
        } catch (error) {
            logger.error(`error to getUserById contributions-dao. Error: ${error}`);
        }
    };
}

module.exports = { ContributionsDAO };
