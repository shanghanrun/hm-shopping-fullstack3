const express = require('express')
const userRouter = express.Router()

const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

userRouter.post('/', userController.createUser) // post '/api/user'
userRouter.post('/login', userController.loginWithEmail) //post 'api/user/login'
userRouter.post('/google', userController.loginWithGoogle)//post 'api/user/google'
userRouter.get('/me', authController.authenticate, userController.getUser) //post 'api/user/me'

module.exports = userRouter;