const express = require('express')
const userController = require('../controllers/userController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const productController = require('../controllers/productController')
const checkoutController = require('../controllers/checkoutController')
const orderController = require('../controllers/orderController')
const chatController = require('../controllers/chatController') // Added import
const router = new express.Router()

// register
router.post('/register', userController.registerController)
// login
router.post('/login', userController.loginController)
// google login
router.post('/google_login', userController.googleLoginController)
// update profile
router.put('/update_profile/:id', jwtMiddleware, userController.updateUserProfileController)
// get all users
router.get('/get-all-users', userController.getAllUsersController)
// update user status/role
router.put('/update-user-status/:id', userController.updateUserStatusController)

// add product
router.post('/add-product', productController.addProduct)
// get all products
router.get('/get-all-products', productController.getAllProducts)
// delete product
router.delete('/delete-product/:id', productController.deleteProduct)
// edit product
router.put('/edit-product/:id', productController.editProduct)

// checkout
router.post('/create-checkout-session', checkoutController.createCheckoutSession)

// orders
router.post('/place-order', orderController.placeOrder)
router.get('/get-user-orders/:userId', orderController.getUserOrders)
router.get('/get-all-orders', orderController.getAllOrders)

// ai chat
router.post('/chat', chatController.handleChat)

module.exports = router