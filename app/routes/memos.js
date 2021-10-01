const { MemosDAO } = require("../data/memos-dao");
const { environmentalScripts } = require("../../config/config");
const { validateMardown } = require("../utils/validateParams");

function MemosHandler() {
    "use strict";

    const memosDAO = new MemosDAO();

    this.addMemos = async (req, res, next) => {
        try {
            const { memo } = req.body;
            const { userId } = req.session;
            const { isValid, error } = validateMardown(memo);
            if (!isValid) {
                const docs = await memosDAO.getAllMemos();
                return res.render("memos", {
                    memosList: docs,
                    userId,
                    markdownError: error,
                    csrftoken: res.locals.csrfToken,
                    environmentalScripts
                });
            }
            await memosDAO.insert(req.body.memo);
            return this.displayMemos(req, res, next);
        } catch (error) {
            console.log('There was an erro to addMemos', error);
        }
    };

    this.displayMemos = async (req, res, next) => {

        const { userId } = req.session;
        try {
            const docs = await memosDAO.getAllMemos();
            return res.render("memos", {
                memosList: docs,
                userId,
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        } catch (error) {
            console.log('There was an error to displayMemos', error);
        }
    };

}

module.exports = MemosHandler;
