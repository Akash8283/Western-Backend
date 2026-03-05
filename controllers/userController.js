const users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// register
exports.registerController = async (req, res) => {
    console.log("registerController");
    console.log(req.body);

    const { username, email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(409).json("Email already exists please Login")
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await users.create({
                username, email, password: hashedPassword
            })
            res.status(200).json(newUser)
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong")
    }
}

// login
exports.loginController = async (req, res) => {
    console.log("loginController");
    const { email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        // console.log(existingUser);

        if (!existingUser) {
            res.status(404).json("User does not exists please register")
        }
        else {
            const isMatch = await bcrypt.compare(password, existingUser.password)
            console.log(isMatch);

            if (!isMatch) {
                res.status(401).json("Email or Password is incorrect")
            }
            else {
                if (existingUser.status !== 'Active') {
                    return res.status(403).json("Your account is suspended. Please contact support.")
                }
                const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role.toLowerCase() }, process.env.JWT_SECRET, { expiresIn: "1h" })
                res.status(200).json({ user: existingUser, token })
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong")
    }
}

// google login
exports.googleLoginController = async (req, res) => {
    console.log("googleLoginController");
    const { username, email, password, picture } = req.body
    try {
        const existingUser = await users.findOne({ email })
        // console.log(existingUser);

        if (!existingUser) {
            // auto register
            const newUser = await users.create({
                username, email, password, picture
            })
            const token = jwt.sign({ userMail: newUser.email, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" })
            res.status(200).json({ user: newUser, token })
        }
        else {
            if (existingUser.status !== 'Active') {
                return res.status(403).json("Your account is suspended. Please contact support.")
            }
            const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role.toLowerCase() }, process.env.JWT_SECRET, { expiresIn: "1h" })
            res.status(200).json({ user: existingUser, token })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong")
    }
}

// update user profile
exports.updateUserProfileController = async (req, res) => {
    console.log("updateUserProfileController");
    const { username, email, address } = req.body
    const { id } = req.params
    try {
        const userData = await users.findByIdAndUpdate(id, {
            username, email, address
        }, { new: true })
        if (!userData) {
            return res.status(404).json("User not found")
        }
        res.status(200).json(userData)
    } catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong")
    }
}

// get all users for admin
exports.getAllUsersController = async (req, res) => {
    try {
        const allUsers = await users.find() // Show all users including admins
        res.status(200).json(allUsers)
    } catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong")
    }
}

// update user role or status
exports.updateUserStatusController = async (req, res) => {
    const { id } = req.params
    const { role, status } = req.body
    try {
        const updatedUser = await users.findByIdAndUpdate(id, { role, status }, { new: true })
        if (!updatedUser) {
            return res.status(404).json("User not found")
        }
        res.status(200).json(updatedUser)
    } catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong")
    }
}