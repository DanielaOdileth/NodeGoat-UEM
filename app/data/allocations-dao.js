const UserDAO = require("./user-dao").UserDAO;
const Allocation = require('../schemas/Allocation');
const { validateNumberParams } = require("../utils/validateParams");
/* The AllocationsDAO must be constructed with a connected database object */
const AllocationsDAO = function () {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof AllocationsDAO)) {
        console.log("Warning: AllocationsDAO constructor called without 'new' operator");
        return new AllocationsDAO();
    }

    /* const allocationsCol = db.collection("allocations"); */
    const userDAO = new UserDAO();

    this.update = async (userId, stocks, funds, bonds) => {
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

                console.log("Updated allocations");
                // add user details
                allocations.username = user.username;
                allocations.firstName = user.firstName;
                allocations.lastName = user.lastName;

                return allocations;
            }
        } catch (error) {
            console.log('there was an error to update user allocations', error);
            return error;
        }
    };


    const searchCriteria = (user, threshold) => {

        if (threshold) {
            const { isValid, errors } = validateNumberParams({ threshold });

            if (!isValid) {
                console.log('Invalid params to get allocations', errors);
                return { isNotValid: true, errors };
            }
            /*
            // Fix for A1 - 2 NoSQL Injection - escape the threshold parameter properly
            // Fix this NoSQL Injection which doesn't sanitze the input parameter 'threshold' and allows attackers
            // to inject arbitrary javascript code into the NoSQL query:
            // 1. 0';while(true){}'
            // 2. 1'; return 1 == '1
            // Also implement fix in allocations.html for UX.                             
            const parsedThreshold = parseInt(threshold, 10);
            
            if (parsedThreshold >= 0 && parsedThreshold <= 99) {
                return {$where: `this.userId == ${parsedUserId} && this.stocks > ${parsedThreshold}`};
            }
            throw `The user supplied threshold: ${parsedThreshold} was not valid.`;
            */
            /*  where: `userId == ${user._id} && stocks > '${threshold}'` */
            return { userId: user._id, stocks: { $gte: Number(threshold) } }
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
                console.log("ERROR: No allocations found for the user");
                return [];
            }
            const userAllocations = allocations.map(allocation => {
                allocation.firstName = user.firstName;
                allocation.lastName = user.lastName;
                return allocation;
            });
            return userAllocations;
        } catch (error) {
            console.log('There was an error to getByUserIdAndThreshold', error);
        }
    };

}

module.exports.AllocationsDAO = AllocationsDAO;
