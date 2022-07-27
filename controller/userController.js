const User = require("../Model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_Id: "Sample Avatar Id",
      url: "Sample Avatar URL",
    },
  });
  sendToken(user, 201, res);
});

let loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

let logOutUser = catchAsyncError(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).send({
    success: true,
    message: "Logged Out",
  });
});

let forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordURL = `${req.protocol}://${req.get(
    "host"
  )}/users/resetPassword/${resetToken}`;
  const messages = `Your Reset Password URL is: \n\n ${resetPasswordURL} \n\n If you have not requested for this then please ignore.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      messages,
    });
    res.status(200).send({
      success: true,
      message: `Email Sent Successfully To ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

let resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

const getUserDetails = catchAsyncError(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).send({
    success: true,
    user,
  });
});

const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password Is Invalid", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords Does'nt Matched", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

let updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  const updatedProfile = {
    name,
    email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, updatedProfile, {
    new: true,
    runValidators: true,
    isFindAndModify: false,
  });
  res.status(200).send({
    success: true,
    message: "Profile Updated",
    user,
  });
};

const getAllUser = catchAsyncError(async (req, res) => {
  const getAllUsers = await User.find();
  res
    .status(200)
    .send({ success: true, message: "Users Fetched", getAllUsers });
});

// Admin

const getSingleUsers = catchAsyncError(async (req, res) => {
  const getSingleUser = await User.findById(req.params.id);
  if (!getSingleUser) {
    return next(
      new ErrorHandler(`User Does'nt Exist With Id ${req.params.id}`, 400)
    );
  }
  res
    .status(200)
    .send({ success: true, message: "User Fetched", getSingleUser });
});
// admin
let updateRole = async (req, res, next) => {
  const { name, email, role } = req.body;
  const updatedUserRole = {
    name,
    email,
    role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, updatedUserRole, {
    new: true,
    runValidators: true,
    isFindAndModify: false,
  });
  res.status(200).send({
    success: true,
    message: "User Role Updated",
    user,
  });
};

// admin

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    new ErrorHandler(`User Does'nt Exist With Id ${req.params.id}`, 400);
  }

  await user.remove();
  res.status(200).send({ success: true, message: "Users Deleted", user });
};

module.exports = {
  registerUser,
  loginUser,
  logOutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUsers,
  updateRole,
  deleteUser,
};
