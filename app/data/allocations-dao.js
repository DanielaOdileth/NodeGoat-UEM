const UserDAO = require("./user-dao").UserDAO;
const Allocation = require('../schemas/Allocation');
const { validateNumberParams } = require("../utils/validateParams");
const logger = require('../utils/logger');
/* The AllocationsDAO must be constructed with a connected database object */
const AllocationsDAO = function () {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof AllocationsDAO)) {
        logger.warn("Warning: AllocationsDAO constructor called without 'new' operator");
        return new AllocationsDAO();
    }

    /* const allocationsCol = db.collection("allocations"); */
    const userDAO = new UserDAO();

    this.update = async (userId, stocks, funds, bonds) => {
        logger.info(`Entering to update allocations for userId ${userId}`)
        /* const parsedUserId = parseInt(userId); */
        const user = await userDAO.getUserById(userId);
        // Create allocations document
        const allocations = {
            userId: user._id,
            stocks: stocks,
            funds: funds,
            bonds: bonds
        };

        try {
            const insertAllocation = await Allocation.updateOne({ userId: user._id }, allocations, { upsert: true }).exec();

            if (insertAllocation) {

                logger.warn(`Updated allocations for userId ${userId}`);
                allocations.username = user.username;
                allocations.firstName = user.firstName;
                allocations.lastName = user.lastName;

                return allocations;
            }
        } catch (error) {
            logger.error(`there was an error to update user allocations for userId: ${userId}. Error: ${error}`);
            return error;
        }
    };


    const searchCriteria = (user, threshold) => {

        if (threshold) {
            const { isValid, errors } = validateNumberParams({ threshold });
            const thresholdNumber = Number(threshold);
            if (!isValid || thresholdNumber > 99) {
                logger.warn(`Invalid params to get allocations for user ${user.userId}. Error: ${errors}`);
                return { isNotValid: true, errors };
            }
            return { userId: user._id, stocks: { $gte: thresholdNumber } }
        }
        return { userId: user._id };
    }


    this.getByUserIdAndThreshold = async (userId, threshold) => {
        try {
            const user = await userDAO.getUserById(userId);
            const queryToSearch = searchCriteria(user, threshold);
            if (queryToSearch.isNotValid) {
                return { errors: queryToSearch.errors }
            }

            const allocations = await Allocation.find(queryToSearch);

            if (!allocations.length) {
                logger.warn(`ERROR: No allocations found for the user ${userId}`);
                return [];
            }
            const userAllocations = allocations.map(allocation => {
                allocation.firstName = user.firstName;
                allocation.lastName = user.lastName;
                return allocation;
            });
            return userAllocations;
        } catch (error) {
            logger.error(`There was an error to getByUserIdAndThreshold ${error}`);
        }
    };

}

module.exports.AllocationsDAO = AllocationsDAO;
