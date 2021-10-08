/* The MemosDAO must be constructed with a connected database object */
const Memo = require('../schemas/Memo');
const logger = require('../utils/logger');
function MemosDAO(db) {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof MemosDAO)) {
        logger.warn("Warning: MemosDAO constructor called without 'new' operator");
        return new MemosDAO();
    }

    /* const memosCol = db.collection("memos"); */

    this.insert = (memo) => {

        // Create allocations document
        const memos = {
            memo,
            timestamp: new Date()
        };

        const newMemo = new Memo(memos);
        return newMemo.save();

    };

    this.getAllMemos = () => {
        return Memo.find({}).sort({ timestamp: -1 }).exec();
    };

}

module.exports = { MemosDAO };
