const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const {
  createPostController,
  getAllPostsController,
  getUserPostsController,
  deleteUserPostsController,
  updatePostsController,
} = require("../controllers/postController");

//router object
const router = express.Router();

//create post || POST
router.post("/create-post", requireSignIn, createPostController);
//get post || GET
router.get("/get-post", getAllPostsController);
//get User || GET
router.get("/get-user-post", requireSignIn, getUserPostsController);
//get User || GET
router.delete("/delete-post/:id", requireSignIn, deleteUserPostsController);
//Update Post || GET
router.put("/update-post/:id", requireSignIn, updatePostsController);

module.exports = router;
