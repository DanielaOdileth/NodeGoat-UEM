/* The BenefitsDAO must be constructed with a connected database object */
const User = require('../schemas/User');
const logger = require('../utils/logger');

function BenefitsDAO() {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof BenefitsDAO)) {
        logger.warn("Warning: BenefitsDAO constructor called without 'new' operator");
        return new BenefitsDAO();
    }

    this.getAllNonAdminUsers = async () => {
        const users =  await User.find({ "isAdmin": { $ne: true } }).exec();
        const usersObjects = users.map(user => {
            const { userId, firstName, lastName, benefitStartDate } = user;
            const benefitDateString = new Date(benefitStartDate).toISOString().split("T")[0];
            return { userId, firstName, lastName, benefitStartDate: benefitDateString };
        })
        return usersObjects;
    };

    this.updateBenefits = (userId, startDate) => {
        return User.updateOne({
            userId,
        }, {
            $set: {
                benefitStartDate: startDate
            }
        }).exec();
    };
}

module.exports = { BenefitsDAO };
