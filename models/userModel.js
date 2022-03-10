const mongoose = require('mongoose');
const schema = mongoose.Schema;

const user = mongoose.model('User', {
    firstName: { type: String, default: '#' },
    lastName: { type: String, default: '#' },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    username: { type: String },
    password: { type: String },
    image: { type: String, default: "" },
    isDisabled: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
});


module.exports = user;