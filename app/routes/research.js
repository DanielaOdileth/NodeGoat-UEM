const { ProfileDAO } = require("../data/profile-dao");
const { ResearchDAO } = require("../data/research-dao");
const needle = require("needle");
const {
    environmentalScripts
} = require("../../config/config");

function ResearchHandler() {
    "use strict";

    const researchDAO = new ResearchDAO();
    const profile = new ProfileDAO();

    this.displayResearch = async (req, res) => {
        const { userId } = req.session;
        const userProfile = await profile.getByUserId(userId);

        if (req.query.symbol) {
            const url = req.query.url + req.query.symbol;
            return needle.get(url, (error, newResponse, body) => {
                if (!error && newResponse.statusCode === 200) {
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                }
                res.write("<h1>The following is the stock information you requested.</h1>\n\n");
                res.write("\n\n");
                if (body) {
                    res.write(body);
                }
                return res.end();
            });
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
