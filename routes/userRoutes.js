const express = require('express');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const router = new express.Router();
const auth = require('../auth/auth');
const user = require('../models/userModel');
const upload = require('../uploads/uploads');
const cart = require('../models/cart');

// route for user registration
router.post('/register', function (req, res) {
    const data = req.body;
    user.findOne({ username: data.username }).then(function (userData) {
        // if username is in database
        if (userData !== null) {
            res.json({ message: "Username already taken!", type: 'error' });
            return;
        } else {
            // else new user data can be inserted in the database
            const password = data.password;
            bcryptjs.hash(password, 10, function (e, hashed_pw) {
                const sData = new user({
                    username: data.username,
                    password: hashed_pw,
                    phone: data.phone,
                    address: data.address,
                    email: data.email
                });

                sData.save().then(function () {
                    res.json({ message: "Registered Successfully!", type: "success" })
                }).catch(function (e) {
                    res.json(e)
                });

            });
        }
    });
});


//route for login
router.post("/login", function (req, res) {
    const data = req.body;
    user.findOne({ username: data.username }).then(function (userData) {
        // console.log(userData);
        if (userData === null) {
            return res.json({ message: "User does not exists!", type: 'error' })
        }

        //checking password
        const password = data.password;
        bcryptjs.compare(password, userData.password, function (e, result) {
            //if true correct password else incorrect
            if (result === false) {
                return res.json({ message: "Invalid Password!", type: 'error' });
            }
            //ticket generate
            const token = jsonwebtoken.sign({ userId: userData._id, username: userData.username, user: userData, image: userData.image }, "anysecrectkey");
            res.json({ token: token, message: 'Successfully Logged In!', type: 'success' });
        });
    });
});

//upload user profile image
router.post("/upload-image", auth.verifyUser, upload.single("image"), function (req, res) {
    if (req.file.path == undefined) {
        res.json({ error: "File not found." })
    }
    else {
        // data = req.
        // const newProfile = new userProfileImage({
        //     image: req.file.path,
        //     profile: req.userInfo._id
        // })
        // newProfile.save()
        user.findByIdAndUpdate(req.userInfo._id, { image: req.file.path }, function (error, docs) {
            if (error) {
                console.log(error)
            } else {
                console.log("Image Done waau")
                req.userInfo.image = req.file.path
                const token = jsonwebtoken.sign({ userId: req.userInfo._id, username: req.userInfo.username, user: req.userInfo, image: req.userInfo.image }, "anysecrectkey");
                res.json({ message: "Profile image updated", type: "success", token: token })
            }
        });
    }
});


router.post("/set-status-online/:userId", auth.verifyUser, function (req, res) {
    user.findByIdAndUpdate(req.userInfo._id, { isActive: true }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            // console.log("Updated!")
        }
    });
});


router.post("/update-profile", auth.verifyUser, function (req, res) {
    if (req.body.field === 'username') {
        if (req.body.username) {
            user.findOne({ username: req.body.username }).then(function (data) {
                if (data) {
                    res.json({ message: "Username already taken", type: "error" })
                } else {
                    user.findByIdAndUpdate(req.userInfo._id, { username: req.body.username }, function (err, docs) {
                        if (!err) {
                            req.userInfo.username = req.body.username
                            console.log(req.userInfo.username)
                            const token = jsonwebtoken.sign({ userId: req.userInfo._id, username: req.userInfo.username, user: req.userInfo, image: req.userInfo.image }, "anysecrectkey");
                            res.json({ message: "Username changed", type: "success", token: token })
                        }
                    });
                }
            })
        } else {
            res.json({ message: "Invalid Username", type: "error" })
        }

    } else if (req.body.field === 'name') {
        // console.log(req.body.firstName)
        // console.log(req.body.lastName)

        if (req.body.fullName || req.body.lastName) {
            user.findByIdAndUpdate(req.userInfo._id, { firstName: req.body.firstName, lastName: req.body.lastName }, function (err, docs) {
                if (!err) {
                    req.userInfo.firstName = req.body.firstName
                    req.userInfo.lastName = req.body.lastName
                    console.log(req.userInfo.firstName)
                    const token = jsonwebtoken.sign({ userId: req.userInfo._id, username: req.userInfo.username, user: req.userInfo, image: req.userInfo.image }, "anysecrectkey");
                    res.json({ message: "Name changed", type: "success", token: token })
                }
            });
        } else {
            res.json({ message: "Invalid Name provided", type: "error" })
        }
    } else if (req.body.field === 'email') {
        console.log(req.body.email)
        if (req.body.email && validator.isEmail(req.body.email)) {
            user.findOne({ email: req.body.email }).then(function (data) {
                if (data) {
                    res.json({ message: "Email already taken", type: "error" })
                } else {
                    user.findByIdAndUpdate(req.userInfo._id, { email: req.body.email }, function (err, docs) {
                        if (!err) {
                            res.json({ message: "Email changed", type: "success" })
                        }
                    });
                }
            })
        } else {
            res.json({ message: "Invalid Email", type: "error" })
        }

    } else {
        res.json({ message: "Enter valid credentials", type: "error" })
    }
});

router.post("/add-to-cart/:productId", auth.verifyUser, function (req, res) {
    const cart_ = new cart({
        user: req.userInfo._id,
        product: req.params.productId
    })

    cart_.save();
    res.json({ message: "Added to your cart", type: "success" });
});

router.get("/my-cart", auth.verifyUser, function (req, res) {
    cart.find({ user: req.userInfo._id }).populate('product').then(function (product) {
        res.json({ data: product });
    })
})


module.exports = router;
