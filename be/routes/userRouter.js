const express = require('express')
const userRouter = express.Router()

const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

userRouter.post('/', userController.createUser) // post '/api/user'
userRouter.post('/new', userController.createNewUser) // admin에서 직접 user만들기

userRouter.post('/login', userController.loginWithEmail) //post 'api/user/login'
userRouter.post('/google', userController.loginWithGoogle)//post 'api/user/google'
userRouter.get('/me', authController.authenticate, userController.getUser) //post 'api/user/me'
userRouter.get('/', authController.authenticate, authController.checkAdminPermission, userController.getUserList)
userRouter.put('/', authController.authenticate, authController.checkAdminPermission, userController.updateUser)


module.exports = userRouter;