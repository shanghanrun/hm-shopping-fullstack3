const express = require('express')
const cartRouter = express.Router()
const cartController =require('../controller/cartController')
const authController =require('../controller/authController')

cartRouter.post('/', authController.authenticate, cartController.createCartItem)
cartRouter.get('/', authController.authenticate, cartController.getCart)
router.delete('/', authController.authenticate, cartController.emptyCart)
cartRouter.post('/:id', authController.authenticate, cartController.deleteCartItem)
cartRouter.put('/:id', authController.authenticate, cartController.updateItemQty)


module.exports =cartRouter