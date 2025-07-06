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

function isAdmin(req, res, next) {
  console.log(`это isAdmin`);
  if (req.session.isAdmin) {
    console.log(`Все прошло норм`);
    return next();
  }
  console.log(`нет прав администратора`);
  res.redirect("/user/login");
}

async function checkUser(req, res, next) {
  const postId = req.params.id;
  const findedPost = await Blog.findById(postId);
  if (findedPost.author == req.session.userId) {
    return next();
  } else {
    console.log("U can't edit not your post");
    return res.redirect("/blogs");
  }
}

module.exports = { isAuthenticated, isAdmin, checkUser };
