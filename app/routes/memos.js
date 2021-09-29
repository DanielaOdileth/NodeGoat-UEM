const { MemosDAO } = require("../data/memos-dao");
const { environmentalScripts } = require("../../config/config");

function MemosHandler() {
    "use strict";

    const memosDAO = new MemosDAO();

    this.addMemos = async (req, res, next) => {
        try {
            await memosDAO.insert(req.body.memo);
            return this.displayMemos(req, res, next);
        } catch (error) {
            console.log('There was an erro to addMemos', error);
        }

        /*  memosDAO.insert(req.body.memo, (err, docs) => {
             if (err) return next(err);
             this.displayMemos(req, res, next);
         }); */
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

        /* memosDAO.getAllMemos((err, docs) => {
            if (err) return next(err);
            return res.render("memos", {
                memosList: docs,
                userId: userId,
                environmentalScripts
            });
        }); */
    };

}

module.exports = MemosHandler;
