const express = require("express");
const router = express.Router();
const userCon = require("../controller/userController");
const {
  isAuthenticated,
  authorizedRole,
} = require("../middleware/isAuthenticated");

router.post("/register", userCon.registerUser);
router.post("/login", userCon.loginUser);
router.get("/logout", userCon.logOutUser);
router.post("/forgotPassword", userCon.forgotPassword);
router.put("/resetPassword/:token", userCon.resetPassword);
router.get("/me", isAuthenticated, userCon.getUserDetails);
router.put("/updatePassword", isAuthenticated, userCon.updatePassword);
router.put("/updateProfile", isAuthenticated, userCon.updateProfile);
router.get(
  "/admin/getallusers",
  isAuthenticated,
  authorizedRole("admin"),
  userCon.getAllUser
);
router.get(
  "/admin/getuser/:id",
  isAuthenticated,
  authorizedRole("admin"),
  userCon.getSingleUsers
);
router.put(
  "/admin/updateRole/:id",
  isAuthenticated,
  authorizedRole("admin"),
  userCon.updateRole
);
router.delete(
  "/admin/deleteUser/:id",
  isAuthenticated,
  authorizedRole("admin"),
  userCon.deleteUser
);

module.exports = router;
