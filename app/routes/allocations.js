const AllocationsDAO = require("../data/allocations-dao").AllocationsDAO;
const {
    environmentalScripts
} = require("../../config/config");

function AllocationsHandler() {
    "use strict";

    const allocationsDAO = new AllocationsDAO();

    this.displayAllocations = async (req, res, next) => {
        /*
        // Fix for A4 Insecure DOR -  take user id from session instead of from URL param
        const { userId } = req.session;
        */
        /* const {
            userId
        } = req.params; */
        const { userId } = req.session;
        console.log('userId ----> ', userId);
        const {
            threshold
        } = req.query

        try {
            console.log('***** GETTING ALLOCATIONS ******');
            const allocations = await allocationsDAO.getByUserIdAndThreshold(userId, threshold);
            console.log('-----> allocations --->', allocations);
            return res.render("allocations", {
                userId,
                allocations,
                environmentalScripts
            });
        } catch (error) {
            console.log('There was an error to displayAllocations', error);
        }
        /* allocationsDAO.getByUserIdAndThreshold(userId, threshold, (err, allocations) => {
            if (err) return next(err);
            return res.render("allocations", {
                userId,
                allocations,
                environmentalScripts
            });
        }); */
    };
}

module.exports = AllocationsHandler;
