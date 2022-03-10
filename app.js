const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./database/connect');


const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(userRoutes);
app.use(productRoutes);

app.use(cors());
app.use(express.static(__dirname + ('/')))

app.listen(5000, function () {
    console.log("Server Started");
});

