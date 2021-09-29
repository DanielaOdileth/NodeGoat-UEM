const mongoose = require("mongoose");
const { Schema } = mongoose;

const Allocation = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    stocks: { type: Number, required: true },
    funds: { type: Number, required: true },
    bonds: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('allocations', Allocation);;
