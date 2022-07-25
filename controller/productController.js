const jwt = require("jsonwebtoken");
const Product = require("../Model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

let createProduct = catchAsyncError(async (req, res) => {
  req.body.user = req.user.id;
  let product = await Product.create(req.body);
  res.statusCode = 201;
  res.send({ messsage: "Successfully Loaded", product });
});

let getAllProducts = catchAsyncError(async (req, res) => {
  const resultPerPage = 2;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const getAllProduct = await apiFeature.query;
  res.statusCode = 200;
  res.send({ messsage: true, getAllProduct, productCount });
});

let getProductDetails = catchAsyncError(async (req, res, next) => {
  let getProduct = await Product.findById(req.params.id);
  if (!getProduct) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.statusCode = 200;
  res.send({ success: true, getProduct });
});

let updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.statusCode = 200;
  res.send({ success: true, product });
});

let deleteProduct = catchAsyncError(async (req, res, next) => {
  let getProduct = await Product.findById(req.params.id);

  if (!getProduct) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  await getProduct.remove();
  res.statusCode = 200;
  res.send({
    success: true,
    messsage: "Product Deleted Successfully",
    getProduct,
  });
});

const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

let getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).send({
    success: true,
    reviews: product.reviews,
  });
});

const deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Review not found", 404));
  }
  const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.reviewId.toString())

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.status(200).send({
    success: true,
  });
})

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview
};
