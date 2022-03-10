const express = require('express');
const router = new express.Router();
const auth = require('../auth/auth');
const furniture = require('../models//furnitureModel');
const upload = require('../uploads/uploadFurniture')

router.post('/add-product', auth.verifyUser, upload.single('image'), function (req, res) {
    const image = req.file.path
    const pname = req.body.name;
    console.log(req.file.path)
    const desc = req.body.description;
    const price = req.body.price;
    const category = req.body.category;
    const data = new furniture({
        image: image,
        name: pname,
        description: desc,
        price: price,
        category: category
    })
    data.save().then(function () {
        res.json({ message: "ok" })
    })
        .catch(function (e) {
            res.json(e)
        })
});

router.get("/get-products/:category", function (req, res) {
    furniture.find({ category: req.params.category }).then(function (data) {
        res.json({ data: data });
    })
})

module.exports = router;