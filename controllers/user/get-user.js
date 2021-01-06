const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const users = [
    {
        id: 'abce',
        name: "Prakash",
        email: "Email",
        data: ["Car", 'House', "SweetHeart"],
    },
    {
        id: 'abcd',
        name: "Second",
        email: "hello",
        data: ["Banana", 'second', "SweetHeart"],
    }
]

const current_user = (req, res, next) => {
        console.log(req.session.user)
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
        console.log(req.session.user);
        res.status(200).json({
            signIn: true,
            user: users[0],
        })


}

exports.current_user = current_user;