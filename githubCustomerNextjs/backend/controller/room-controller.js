const Room = require('../models/rooms');

exports.addRoom = async (req, res) => {
    try {
        const { name, category, price, description, totalInventory, availableInventory, status } = req.body;
        const newRoom = new Room({
            name, category, price, description, totalInventory, availableInventory, status
        });

        const savedRoom = await newRoom.save();
        res.status(201).json({ success: true, data: savedRoom });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getRoom = async (req, res) => {
    const data = await Room.find();
    res.status(201).json({ success: true, data: data });

}

exports.DeleteRoom = async (req, res) => {
    await Room.findByIdAndDelete(req.params.id);
    res.status(201).json({ success: true, msg: "room delete" });


}


