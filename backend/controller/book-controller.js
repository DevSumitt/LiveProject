const Book = require("../models/booking")
const Room = require('../models/rooms');


exports.booking = async (req, res) => {
    try {
        const { name, email, RoomName, RoomType, RoomPrice, checkIn, checkOut, guest } = req.body;
        const addBooking = new Book({
            fullname: name,
            email: email,
            RoomName: RoomName,
            type: RoomType,
            checkin: checkIn,
            checkout: checkOut,
            guest: guest,
            totalAmount: RoomPrice
        });

        await addBooking.save();
        const updatedRoom = await Room.findOneAndUpdate(
            { name: RoomName, availableInventory: { $gt: 0 } },
            { $inc: { availableInventory: -1 } },
            { new: true }
        );

        if (!updatedRoom) {
            return res.status(400).json({ msg: "Room not available or not found" });
        }

        res.status(201).json({
            msg: "Your room is booked now",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
    }
}

exports.getBooking = async (req, res) => {
    const data = await Book.find();
    res.status(201).json({ msg: "booking fetch", data: data  })

}
exports.DeleteBooking = async (req, res) => {
    try {
        const deletedBooking = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBooking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        res.status(200).json({
            msg: "Booking deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
};
