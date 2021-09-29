const mongoose = require("mongoose");
const { Schema } = mongoose;

const Memo = new Schema({
    memo: { type: String, required: true },
    timestamp: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('memos', Memo);;