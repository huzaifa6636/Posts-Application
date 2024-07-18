const express = require("express");
const {
  registerController,
  loginController,
  updateUser,
  requireSignIn,
} = require("../controllers/userController");

//router object
const router = express.Router();

//routes
//register || POST
router.post("/register", registerController);

//Login || POST
router.post("/login", loginController);

//update-user || Put
router.put("/update-user", requireSignIn, updateUser);

//export
module.exports = router;
