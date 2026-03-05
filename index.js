require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./routes/route')
require('./config/db')

const skyniche = express()
skyniche.use(cors())
skyniche.use(express.json({ limit: '30mb' }))
skyniche.use(routes)

const PORT = 3000

skyniche.listen(PORT, () => {
    console.log("server started listening");
})

skyniche.get('/', (req, res) => {
    res.status(200).send("server started listening")
})