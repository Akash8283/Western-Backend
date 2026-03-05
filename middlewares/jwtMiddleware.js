const jwt = require('jsonwebtoken')

const jwtMiddleware = async (req, res, next) => {
    console.log("jwtMiddleware");
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader) {
            return res.status(404).json("Authorization Failed! Token is missing")
        }

        const token = authHeader.split(" ")[1]
        if (!token) {
            return res.status(404).json("Authorization Failed! Token format is invalid")
        }

        const jwtResponse = jwt.verify(token, process.env.JWT_SECRET)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
        next()
    } catch (err) {
        console.log(err);
        res.status(401).json("Authorization Failed! Invalid Token ")
    }
}

module.exports = jwtMiddleware