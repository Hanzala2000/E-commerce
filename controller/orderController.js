const Order = require('../Model/orderModel')
const catchAsyncError = require("../middleware/catchAsyncErrors");
const Product = require("../Model/productModel");
const ErrorHandler = require("../utils/errorHandler");

const newOrder = catchAsyncError(async (req, res) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user._id
    })
    res.status(201).send({
        success: true,
        order
    })
})

const getOrderDetails = catchAsyncError(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return new (ErrorHandler("Order Not Found With This Id", 404))
    }
    res.status(200).send({
        success: true,
        order
    })
})

const getUserOrders = catchAsyncError(async (req, res) => {
    const order = await Order.find({user:req.user._id})
    res.status(200).send({
        success: true,
        order
    })
    
})
module.exports = { newOrder, getOrderDetails, getUserOrders }