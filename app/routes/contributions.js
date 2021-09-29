const { ContributionsDAO } = require("../data/contributions-dao");
const {
    environmentalScripts
} = require("../../config/config");

/* The ContributionsHandler must be constructed with a connected db */
function ContributionsHandler() {
    "use strict";

    const contributions = new ContributionsDAO();

    this.displayContributions = async (req, res, next) => {
        const { userId } = req.session;

        try {
            const contributionsResponse = await contributions.getByUserId(userId);
            /* const { firstName, lastName } = contributionsResponse; */
            contributionsResponse.userId = userId;
            contributionsResponse.csrftoken = res.locals.csrfToken;
            /* contrib.userId = userId; //set for nav menu items */
            return res.render("contributions", {
                /* firstName,
                lastName,
                userId,
                csrftoken: res.locals.csrfToken, */
                ...contributionsResponse,
                environmentalScripts
            });
        } catch (error) {
            console.log('There was an error to displayContributions', error);
        }

        /* contributionsDAO.getByUserId(userId, (error, contrib) => {
            if (error) return next(error);

            contrib.userId = userId; //set for nav menu items
            return res.render("contributions", {
                ...contrib,
                environmentalScripts
            });
        }); */
    };

    this.handleContributionsUpdate = async (req, res, next) => {

        /*jslint evil: true */
        // Insecure use of eval() to parse inputs
        const preTax = eval(req.body.preTax);
        const afterTax = eval(req.body.afterTax);
        const roth = eval(req.body.roth);

        /*
        //Fix for A1 -1 SSJS Injection attacks - uses alternate method to eval
        const preTax = parseInt(req.body.preTax);
        const afterTax = parseInt(req.body.afterTax);
        const roth = parseInt(req.body.roth);
        */
        const { userId } = req.session;

        //validate contributions
        const validations = [isNaN(preTax), isNaN(afterTax), isNaN(roth), preTax < 0, afterTax < 0, roth < 0]
        const isInvalid = validations.some(validation => validation)
        if (isInvalid) {
            return res.render("contributions", {
                updateError: "Invalid contribution percentages",
                userId,
                environmentalScripts
            });
        }
        // Prevent more than 30% contributions
        if (preTax + afterTax + roth > 30) {
            return res.render("contributions", {
                updateError: "Contribution percentages cannot exceed 30 %",
                userId,
                environmentalScripts
            });
        }

        try {
            const contributionsUpdated =  await contributions.update(userId, preTax, afterTax, roth)
            contributionsUpdated.updateSuccess = true;
            contributionsUpdated.csrftoken = res.locals.csrfToken;
            return res.render("contributions", {
                ...contributionsUpdated,
                environmentalScripts
            });
        } catch (error) {
            console.log('there was an error to handleContributionsUpdate', error);
        }
        /* contributionsDAO.update(userId, preTax, afterTax, roth, (err, contributions) => {

            if (err) return next(err);

            contributions.updateSuccess = true;
            return res.render("contributions", {
                ...contributions,
                environmentalScripts
            });
        }); */

    };

}

module.exports = ContributionsHandler;
