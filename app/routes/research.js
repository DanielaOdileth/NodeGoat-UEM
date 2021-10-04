const { ProfileDAO } = require("../data/profile-dao");
const { ResearchDAO } = require("../data/research-dao");
const needle = require("needle");
const {
    environmentalScripts
} = require("../../config/config");
const { validateSymbol } = require("../utils/validateParams");

function ResearchHandler() {
    "use strict";

    const profile = new ProfileDAO();

    this.displayResearch = async (req, res) => {
        const { userId } = req.session;
        const userProfile = await profile.getByUserId(userId);
        const { symbol } = req.query;
        const { isValid, error } = validateSymbol(symbol);
        if (symbol && !isValid) {
            return res.render("research", {
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                researchError: error,
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }

        if (symbol) {
            const yahooUrl = 'https://finance.yahoo.com/quote/'
            const url = `${yahooUrl}${symbol}`;
            return res.redirect(`${url}`)
        }

        return res.render("research", {
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            csrftoken: res.locals.csrfToken,
            environmentalScripts
        });
    };

}

module.exports = ResearchHandler;
