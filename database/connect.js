const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/furniture', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});