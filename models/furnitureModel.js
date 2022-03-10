const mongoose = require('mongoose');
const schema = mongoose.Schema;

const furniture = mongoose.model('Furniture', {
    name: { type: String },
    image: { type: String },
    description: { type: String },
    price: { type: String },
    category: { type: String }
});

module.exports = furniture;
