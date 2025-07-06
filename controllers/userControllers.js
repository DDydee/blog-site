const User = require("../models/user");
const bcrypt = require("bcrypt");

const user_registration = (req, res) => {
  res.render("user/registration", {
    title: "Registration",
    errors: {},
    old: {},
  });
};

function checkUser(email) {
  User.findOne({ email: email }).then((user) => (user ? true : false));
}

const user_registration_post = async (req, res) => {
  const { login, email, password } = req.body;

  if (checkUser(email)) {
    console.log("Почта уже используется");
    return res.redirect("/user/registration");
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ login, email, password: hashPassword });

    const savedUser = await user.save();
    req.session.userId = savedUser._id;
    req.session.isAdmin = savedUser.isAdmin;
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
};

const user_login_in_post = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("Пользователь не найден");
        return res.redirect("/user/login");
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Ошибка сравнения паролей:", err);
          return res.status(500).send("Ошибка сервера");
        }

        if (!isMatch) {
          console.log("Неверный пароль");
          return res.redirect("/user/login");
        }

        req.session.userId = user._id;
        req.session.isAdmin = user.isAdmin;
        res.redirect("/blogs");
      });
    })
    .catch((err) => {
      console.log("Некоректно введенные данные!");
      console.error(err);
    });
};

const user_login_get = (req, res) => {
  res.render("user/login", { title: "Login page" });
};

const user_page = (req, res) => {
  res.render("user/user", { title: "User page" });
};

module.exports = {
  user_registration,
  user_registration_post,
  user_page,
  user_login_get,
  user_login_in_post,
};
