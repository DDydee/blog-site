const express = require("express");
const { body, validationResult } = require("express-validator");
const blogController = require("../controllers/blogControllers");
const metaController = require("../controllers/metaControllers");
const Auth = require("../middleware/Autethicated");
const { postValidation, checkBlog } = require("../middleware/Validation");

const router = express.Router();

router.get("/", blogController.blog_index);

router.post("/", postValidation, checkBlog, blogController.blog_create_post);

router.get("/page", blogController.blogs_page);

router.post("/:id/like", Auth.isAuthenticated, metaController.blog_like_post);

router.get("/create", Auth.isAuthenticated, blogController.blog_create_get);

router.get(
  "/edit/:id",
  Auth.isAuthenticated,
  Auth.checkUser,
  blogController.blog_edit_get
);

router.post(
  "/comment",
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Комментарий не должен быть пустым.")
    .custom((value) => {
      if (!value.trim()) {
        throw new Error("Комментарий не должен состоять только из пробелов.");
      }
      return true;
    }),
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.redirect(`/blogs/${req.query.id}`);
    }
    return next();
  },
  Auth.isAuthenticated,
  metaController.blog_comment_post
);

router.put("/edit/:id", blogController.blog_edit_put);

router.get("/:id", Auth.checkUser, blogController.blog_details);

router.delete(
  "/:id",
  Auth.isAuthenticated,
  Auth.checkUser,
  blogController.blog_delete
);

module.exports = router;
