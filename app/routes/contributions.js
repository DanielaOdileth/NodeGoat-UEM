const { ContributionsDAO } = require("../data/contributions-dao");
const {
    environmentalScripts
} = require("../../config/config");
const { validateNumberParams } = require("../utils/validateParams");
const logger = require('../utils/logger');

/* The ContributionsHandler must be constructed with a connected db */
function ContributionsHandler() {
    "use strict";

    const contributions = new ContributionsDAO();

    this.displayContributions = async (req, res, next) => {
        const { userId } = req.session;

        try {
            const contributionsResponse = await contributions.getByUserId(userId);
            contributionsResponse.userId = userId;
            contributionsResponse.csrftoken = res.locals.csrfToken;

            return res.render("contributions", {
                ...contributionsResponse,
                environmentalScripts
            });
        } catch (error) {
            logger.error(`There was an error to displayContributions for userId: ${userId}. Error: ${error}`);
            return res.render("contributions", {
                updateError: 'There was an error display contributions',
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }
    };

    this.handleContributionsUpdate = async (req, res, next) => {
        const { preTax, afterTax, roth } = req.body;
        const params = { preTax, afterTax, roth };
        const { userId } = req.session;
        logger.info(`Entering to update contributions for userId ${userId}`);

        const { isValid, errors } = validateNumberParams(params, Object.keys(params));

        if (!isValid) {
            logger.warn(`Invalid params to update contributions for userId ${userId}. Error: ${errors}`);
            return res.render("contributions", {
                updateError: "Invalid contribution percentages values",
                userId,
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }
        // Prevent more than 30% contributions
        if ((Number(preTax) + Number(afterTax) + Number(roth)) > 30) {
            logger.info(`Contribution percentages cannot exceed 30 %`)
            return res.render("contributions", {
                updateError: "Contribution percentages cannot exceed 30 %",
                userId,
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }

        try {
            const contributionsUpdated = await contributions.update(userId, preTax, afterTax, roth)
            contributionsUpdated.updateSuccess = true;
            contributionsUpdated.csrftoken = res.locals.csrfToken;
            logger.info(`contributions for userId: ${userId} was updated`)
            return res.render("contributions", {
                ...contributionsUpdated,
                environmentalScripts
            });
        } catch (error) {
            logger.error(`there was an error to handleContributionsUpdate ${error}`);
            return res.render("contributions", {
                updateError: 'There was an error to update contributions',
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }
    };

}

module.exports = ContributionsHandler;
