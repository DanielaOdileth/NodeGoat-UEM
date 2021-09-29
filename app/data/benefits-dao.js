/* The BenefitsDAO must be constructed with a connected database object */
const User = require('../schemas/User');

function BenefitsDAO() {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof BenefitsDAO)) {
        console.log("Warning: BenefitsDAO constructor called without 'new' operator");
        return new BenefitsDAO();
    }

    /* const usersCol = db.collection("users"); */
    /* const userDAO = new UserDAO(); */

    this.getAllNonAdminUsers = () => {
        return User.find({ "isAdmin": { $ne: true } }).exec();
        /* .toArray((err, users) => callback(null, users)); */
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
