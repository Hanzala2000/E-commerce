const express = require('express')
const router = express.Router()
const productCon = require('../controller/productController')
const { isAuthenticated, authorizedRole } = require('../middleware/isAuthenticated')


router.route('/reviews').get(productCon.getProductReviews).delete(isAuthenticated, productCon.deleteReview)
router.get('/', productCon.getAllProducts)
router.post('/admin/new', isAuthenticated, authorizedRole('admin'), productCon.createProduct)
router.put('/admin/:id', isAuthenticated, authorizedRole('admin'), productCon.updateProduct)
router.delete('/admin/:id', isAuthenticated, authorizedRole('admin'), productCon.deleteProduct)
router.get('/:id', productCon.getProductDetails)
router.put('/review', isAuthenticated, productCon.createProductReview)



module.exports = router