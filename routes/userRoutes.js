const express = require("express");
const { checkValidator } = require("../middleware/Validation");
const userControllers = require("../controllers/userControllers");

const router = express.Router();

router.get("/registration", userControllers.user_registration);
router.post(
  "/registration",
  checkValidator,
  userControllers.user_registration_post
);
router.get("/", userControllers.user_page);
router.get("/login", userControllers.user_login_get);
router.post("/login", checkValidator, userControllers.user_login_in_post);
router.get("/logout", userControllers.user_logout);

module.exports = router;
