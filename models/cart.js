const mongoose = require('mongoose');
const schema = mongoose.Schema;

const cart = mongoose.model('Cart', {
    user: { type: schema.Types.ObjectId, ref: "User" },
    product: { type: schema.Types.ObjectId, ref: "Furniture" },
});

module.exports = cart;