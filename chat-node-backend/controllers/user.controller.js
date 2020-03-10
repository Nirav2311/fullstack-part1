const User = require('../models/user.model.js');
let passwordHash = require('password-hash');

// signup
exports.signup = (req, res) => {
    let { email, password, username } = req.body;
    let validations = [
        {
            isValid: email && (email.length > 0),
            errorMsg: "Email is required"
        },
        {
            isValid: password && (password.length > 0),
            errorMsg: "Password is required"
        },
        {
            isValid: username && (username.length > 0),
            errorMsg: "Username is required"
        }
    ];

    // Validate request
    validations.forEach(obj => {
        if (!obj.isValid) {
            return res.status(400).send({
                status: "failure",
                code: 400,
                data: {
                    errorMsg: obj.errorMsg
                }
            });
        }
    })

    // Create a User
    const user = new User({
        email, password, username
    });

    // Save User in the database
    user.save()
        .then(data => {
            let profileData = {
                _id: data._id,
                email: data.email,
                username: data.username,
            };
            res.status(200).send({
                status: "success",
                code: 200,
                data: {
                    message: "Login successful.",
                    profileData
                }
            });
        }).catch(err => {
            let errorMsg = err.message || "Some error occurred while creating the User.";
            if (err.code == 11000) {
                errorMsg = "Email is already registered."
            }
            res.status(500).send({
                status: "failure",
                code: 500,
                data: {
                    errorMsg: errorMsg
                }
            });
        });
};

// signin
exports.signin = (req, res) => {
    let { email, password } = req.body;

    let validations = [
        {
            isValid: email && (email.length > 0),
            errorMsg: "Email is required"
        },
        {
            isValid: password && (password.length > 0),
            errorMsg: "Password is required"
        }
    ];

    // Validate request
    validations.forEach(obj => {
        if (!obj.isValid) {
            return res.status(400).send({
                status: "failure",
                code: 400,
                data: {
                    errorMsg: obj.errorMsg
                }
            });
        }
    })

    User.find({
        email
    })
        .then(data => {
            console.log(data);
            if (data.length == 0) {
                res.status(400).send({
                    status: "failure",
                    code: 400,
                    data: {
                        errorMsg: "Email not registered. Please signup first."
                    }
                });
            } else {
                if (!passwordHash.verify(password, data[0] && data[0].password)) {
                    res.status(400).send({
                        status: "failure",
                        code: 400,
                        data: {
                            errorMsg: "Incorrect password."
                        }
                    });
                } else {
                    let profileData = {
                        _id: data[0]._id,
                        email: data[0].email,
                        username: data[0].username,
                    };

                    res.status(200).send({
                        status: "success",
                        code: 200,
                        data: {
                            message: "Login successful.",
                            profileData
                        }
                    });
                }
            }
        }).catch(err => {
            let errorMsg = err.message || "Some error occurred while creating the User.";

            res.status(500).send({
                status: "failure",
                code: 500,
                data: {
                    errorMsg: errorMsg
                }
            });
        });

};