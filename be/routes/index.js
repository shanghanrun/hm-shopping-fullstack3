const express = require('express')
const indexRouter = express.Router()

const userRouter = require('./userRouter')

indexRouter.use('/user', userRouter)


module.exports = indexRouter;