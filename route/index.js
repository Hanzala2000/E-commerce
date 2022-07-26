const express = require('express')
const router = express.Router()
const productRoutes = require('./productRoutes')
const userRoutes = require('./userRoutes')
const orderRoutes = require('./orderRoutes')

router.use('/products', productRoutes)
router.use('/users', userRoutes)
router.use('/order', orderRoutes)

module.exports = router