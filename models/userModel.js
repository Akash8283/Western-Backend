const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    picture: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "Active"
    },

}, { timestamps: true })

const users = mongoose.model("users", userSchema)
module.exports = users

