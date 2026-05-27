const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    fullname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    RoomName: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    checkin: {
        type: String,
    },
    checkout: {
        type: String,
    },
    guest: {
        type: String,
    },
    totalAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);