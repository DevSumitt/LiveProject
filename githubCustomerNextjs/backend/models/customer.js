
const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({

    Name: {
        type: String,
        require: true
    },
    Email: {
        type: String,
        unique: true
    },
    Password: {
        type: String,
    },
    GoogleId: {
        type: String,
    },
    Number: {
        type: Number,
    },
    ProfileImg: {
        type: String,
    },
    Otp: {
        type: String,
    },
    isVerify: {
        type: String,
        default: "false"
    },
    isSignotp: {
        type: String,
    },
    Activated: {
        type: String,
        default: "Yes"
    },
    Date: {
        type: Date,
        default: Date.now
    }


})

module.exports = mongoose.model('customers', customerSchema);
