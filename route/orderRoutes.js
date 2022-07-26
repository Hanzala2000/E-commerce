const express = require('express')
const router = express.Router()
const orderCon = require('../controller/orderController')
const { isAuthenticated, authorizedRole } = require('../middleware/isAuthenticated')

router.post('/new', isAuthenticated, orderCon.newOrder)
router.get('/me', isAuthenticated, orderCon.getUserOrders)
router.get('/:id', isAuthenticated, authorizedRole("admin"), orderCon.getOrderDetails)


module.exports = router