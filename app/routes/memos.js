const { MemosDAO } = require("../data/memos-dao");
const { environmentalScripts } = require("../../config/config");
const { validateMardown } = require("../utils/validateParams");
const logger = require('../utils/logger');

function MemosHandler() {
    "use strict";

    const memosDAO = new MemosDAO();

    this.addMemos = async (req, res, next) => {
        try {
            const { memo } = req.body;
            const { userId } = req.session;
            logger.info(`Entering to add memos for userId: ${userId}`);
            const { isValid, error } = validateMardown(memo);
            if (!isValid) {
                logger.warn(`markdown value is not valid, for userId: ${userId}`);
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
            logger.error(`There was an error to addMemos ${error}`);
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
           logger.error(`There was an error to displayMemos. Error: ${error}`);
        }
    };

}

module.exports = MemosHandler;
