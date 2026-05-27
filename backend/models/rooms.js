const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    totalInventory: Number,
    availableInventory: Number,
    image: String,
    category: String,
    status: String
});

module.exports = mongoose.model('Room', roomSchema);