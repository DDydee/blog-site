const Blog = require("../models/blog");

function isAuthenticated(req, res, next) {
  console.log(`это isAuthenticated ${req.session}`);
  if (req.session.userId) {
    console.log(`Все прошло норм ${req.session}`);
    return next();
  }
  console.log(`нужно залогиниться`);
  res.redirect("/user/login");
}

function setLocalsData(req, res, next) {
  res.locals.currentUser = req.session.userId || null;
  res.locals.userIsAdmin = req.session.isAdmin || null;
  next();
}

async function checkUser(req, res, next) {
  if (req.session.isAdmin) {
    console.log(`Все прошло норм`);
    res.locals.notUserPost = false;
    return next();
  }
  const postId = req.params.id;
  const findedPost = await Blog.findById(postId);
  if (findedPost.author == req.session.userId) {
    res.locals.notUserPost = false;
    return next();
  } else {
    res.locals.notUserPost = true;
    return next();
  }
}

module.exports = { isAuthenticated, checkUser, setLocalsData };
