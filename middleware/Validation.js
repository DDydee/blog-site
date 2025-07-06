const { body, validationResult } = require("express-validator");

const passwordRule = body("password")
  .isLength({ min: 8 })
  .withMessage("Пароль должен быть не менее 8 символов")
  .matches(
    /^(?=.*[0-9])(?=.*[A-Za-zА-Яа-яЁё])[0-9A-Za-zА-Яа-яЁё!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]*$/
  )
  .withMessage(
    "Пароль должен содержать хотя бы одну цифру и одну букву (латинскую или кириллическую), может включать спецсимволы"
  );

const emailRule = body("email")
  .isEmail()
  .withMessage("Невалидный email")
  .normalizeEmail();

const usernameRule = body("login")
  .trim()
  .notEmpty()
  .withMessage("Имя пользователя обязательно")
  .isLength({ min: 3 })
  .withMessage("Имя должно быть не короче 3 символов");

function checkValidator(req, res, next) {
  let validations = [];

  switch (req.originalUrl) {
    case "/user/login":
      validations = [emailRule, passwordRule];
      break;

    case "/user/registration":
      validations = [emailRule, usernameRule, passwordRule];
      break;

    default:
      return next();
  }
  Promise.all(validations.map((validation) => validation.run(req))).then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorObj = {};

      errors.array().forEach((err) => {
        errorObj[err.path] = err.msg;
      });

      return res.status(422).render(`user/${req.path}`, {
        title: "Registration",
        errors: errorObj,
        old: req.body,
      });
    } else {
      return next();
    }
  });
}

const postValidation = [
  body("title")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("В названии должно быть больше 3 символов"),
  body("snippet").notEmpty().withMessage("Поле не должно быть пустым"),
  body("body").notEmpty().withMessage("Поле не должно быть пустым"),
];

function checkBlog(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorObj = {};

    errors.array().forEach((err) => {
      errorObj[err.path] = err.msg;
    });

    return res.render("blogs/create", {
      title: "Create Blog",
      errors: errorObj,
      blog: req.body,
      formAction: "/blogs",
    });
  } else {
    return next();
  }
}

module.exports = {
  checkValidator,
  postValidation,
  checkBlog,
};
