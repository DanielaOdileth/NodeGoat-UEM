const mongoose = require("mongoose");
const { Schema } = mongoose;

const Contribution = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    preTax: { type: Number, required: true },
    roth: { type: Number, required: true },
    afterTax: { type: Number, required: true },
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('contributions', Contribution);;