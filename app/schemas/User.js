const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    email: { type: String },
    address: { type: String },
    bankAcc: { type: String },
    bankRouting: { type: String },
    ssn: { type: String },
    benefitStartDate: { type: Date },
    dob: { type: Date },
    website: { type: String },
    isEnabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('users', User);;
