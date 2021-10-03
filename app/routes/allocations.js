const AllocationsDAO = require("../data/allocations-dao").AllocationsDAO;
const {
    environmentalScripts
} = require("../../config/config");
function AllocationsHandler() {
    "use strict";

    const allocationsDAO = new AllocationsDAO();

    this.displayAllocations = async (req, res, next) => {
        const { userId } = req.session;
        const { threshold } = req.query

        try {
            const allocations = await allocationsDAO.getByUserIdAndThreshold(userId, threshold);
            if(allocations.errors){
                return res.render("allocations", {
                    userId,
                    allocationsError: allocations.errors,
                    environmentalScripts
                });
            }
            return res.render("allocations", {
                userId,
                allocations,
                environmentalScripts
            });
        } catch (error) {
            console.log('There was an error to displayAllocations', error);
            return res.render("allocations", {
                userId,
                allocationsError: 'There was an error to displayAllocations',
                environmentalScripts
            });
        }
    };
}

module.exports = AllocationsHandler;
