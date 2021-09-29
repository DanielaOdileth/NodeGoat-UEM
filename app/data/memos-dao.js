/* The MemosDAO must be constructed with a connected database object */
const Memo = require('../schemas/Memo');

function MemosDAO(db) {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof MemosDAO)) {
        console.log("Warning: MemosDAO constructor called without 'new' operator");
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

        /* memosCol.insert(memos, (err, result) => !err ? callback(null, result) : callback(err, null)); */
    };

    this.getAllMemos = () => {
        return Memo.find({}).sort({ timestamp: -1 }).exec();
        /* memosCol.find({}).sort({
            timestamp: -1
        }).toArray((err, memos) => {
            if (err) return callback(err, null);
            if (!memos) return callback("ERROR: No memos found", null);
            callback(null, memos);
        }); */
    };

}

module.exports = { MemosDAO };
