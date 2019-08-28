//Files and Apis
const express = require('express')
require('./db/mongoose')
const Users = require('./models/user')
const userRouter = require('./routers/user')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5000

//Middlewares policies, type object recieved and routers
app.use(cors());
app.use(express.json());
app.use(userRouter)

//Authentication token


//listening the port
app.listen(port, () => {
    console.log('Server is on ' + port)
})