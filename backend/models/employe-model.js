const mongoose = require('mongoose');
const EmployeSchema = new mongoose.Schema({
    EmployeId: {
        type: String
    },
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
    Joined: {
        type: String
    },
    Salary: {
        type: Number
    }

})

module.exports = mongoose.model('SKILLEMPLOYE', EmployeSchema);
