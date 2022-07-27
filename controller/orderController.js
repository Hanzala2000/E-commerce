const Order = require('../Model/orderModel')
const catchAsyncError = require("../middleware/catchAsyncErrors");
const Product = require("../Model/productModel");
const ErrorHandler = require("../utils/errorHandler");

const newOrder = catchAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user._id
    })
    res.status(201).send({
        success: true,
        order
    })
})

const getOrderDetails = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if (!order) {
        return next(new ErrorHandler("Order Not Found With This Id", 404))
    }
    res.status(200).send({
        success: true,
        order
    })
})

const getUserOrders = catchAsyncError(async (req, res, next) => {
    const order = await Order.find({ user: req.user._id })
    res.status(200).send({
        success: true,
        order
    })

})

const getAllOrders = catchAsyncError(async (req, res, next) => {
    const order = await Order.find()

    let totalAmount = 0;
    order.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).send({
        success: true,
        order,
        totalAmount
    })
})
// Admin
const updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ErrorHandler("Order Not Found With This Id", 404))
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You Have Delivered This Order", 400))
    }
    order.orderItems.forEach(async (o) => {
     await  updateStock(o.product, o.quantity)
    })
    order.orderStatus = req.body.status

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now
    }

    await order.save({ validateBeforeSave: false })
    res.status(200).send({
        success: true,
        order,
    })
})
async function updateStock(id, quantity) {
    const product = await Product.findById(id)
    product.stock -= quantity
    await product.save({ validateBeforeSave: false })
}
// Admin
const deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler("Order Not Found With This Id", 404))
    }
    await order.remove()
    res.status(200).send({
        success: true,
    })
})

module.exports = { newOrder, getOrderDetails, getUserOrders, getAllOrders, updateOrder, deleteOrder }