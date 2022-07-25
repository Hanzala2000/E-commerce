const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login In First", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);
  next();
});

const authorizedRole = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new ErrorHandler("Only Admin Is Allowed To Access This Resource", 403)
      );
    }
    next();
  };
};
module.exports = {
  isAuthenticated,
  authorizedRole,
};
