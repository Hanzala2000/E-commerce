const express = require('express')
const router = express.Router()
const orderCon = require('../controller/orderController')
const { isAuthenticated, authorizedRole } = require('../middleware/isAuthenticated')

router.post('/new', isAuthenticated, orderCon.newOrder)
router.get('/me', isAuthenticated, orderCon.getUserOrders)
router.get('/admin/allOrders', isAuthenticated,authorizedRole("admin"), orderCon.getAllOrders)
router.get('/:id', isAuthenticated, orderCon.getOrderDetails)
router.delete('/admin/order/:id', isAuthenticated,authorizedRole("admin"), orderCon.deleteOrder)
router.put('/admin/order/:id', isAuthenticated,authorizedRole("admin"), orderCon.updateOrder)


module.exports = router