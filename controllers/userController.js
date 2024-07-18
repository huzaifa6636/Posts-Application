const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModal = require("../models/userModal");
const { expressjwt: jwt } = require("express-jwt");

//Middle Ware
const requireSignIn = jwt({
  secret: process.env.SECRET_KEY,
  algorithms: ["HS256"],
});
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.status(404).send({
        success: false,
        message: "Name is Required",
      });
    }
    if (!email) {
      return res.status(404).send({
        success: false,
        message: "Email is Required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(404).send({
        success: false,
        message: "Password is Required and 6 character long",
      });
    }
    //existing user
    const existingUser = await userModal.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User already exists",
      });
    }
    //hashed password
    const hashedPassword = await hashPassword(password);

    //Save User
    const user = await userModal({
      name,
      email,
      password: hashedPassword,
    }).save();
    return res.status(201).send({
      success: true,
      message: "Registration successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in registration API",
      error,
    });
  }
};
//Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Provide Email and Password",
      });
    }
    //find user
    const user = await userModal.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "No User Found",
      });
    }
    //match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    //Token JWT
    const token = await JWT.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "Login Success",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in login API",
      error: error.message,
    });
  }
};

//Update
const updateUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const user = await userModal.findOne({ email });
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and must be at least 6 characters long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    //updated user
    const updatedUser = await userModal.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile updated successfully Login Again",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in Update API",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUser,
  requireSignIn,
};
