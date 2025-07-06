const express = require("express");
const blogController = require("../controllers/blogControllers");
const Auth = require("../middleware/Autethicated");
const { postValidation, checkBlog } = require("../middleware/Validation");

const router = express.Router();

router.get("/", blogController.blog_index);

router.post("/", postValidation, checkBlog, blogController.blog_create_post);

router.post("/:id/like", blogController.blog_like_post);

router.get("/create", Auth.isAuthenticated, blogController.blog_create_get);

router.get("/edit/:id", Auth.checkUser, blogController.blog_edit_get);

router.put("/edit/:id", blogController.blog_edit_put);

router.get("/:id", blogController.blog_details);

router.delete(
  "/:id",
  Auth.isAuthenticated,
  Auth.isAdmin,
  blogController.blog_delete
);

module.exports = router;
