const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    userId: { type: String, required: true, unique: true }, 
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true }, // https://coderrocketfuel.com/article/store-passwords-in-mongodb-with-node-js-mongoose-and-bcrypt
    isAdmin: { type: Boolean, default: false },
    email: { type: String },
    address: { type: String },
    bankAcc: { type: Number },
    bankRouting: { type: String },
    ssn: { type: Number },
    benefitStartDate: { type: Date },
    dob: { type: Date },
    website: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('users', User);;
