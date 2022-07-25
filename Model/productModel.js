const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter Product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Enter Product Description"],
  },
  price: {
    type: Number,
    required: [true, "Enter Product Price"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_Id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Enter Product Category"],
  },
  stock: {
    type: Number,
    maxLength: [3, "Maximum 4 characters"],
    default: 1,
    required: [true, "Enter Product Stock"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
