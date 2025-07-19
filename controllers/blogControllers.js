const Blog = require("../models/blog");
const marked = require("marked");
const limit = 10;

const blog_index = (req, res) => {
  console.log(req.session.userId);
  const query = req.query.query || "";
  const page = parseInt(req.query.page) || 1;
  getBlogs(page, limit, query).then((blogs) => {
    res.render("blogs/index", {
      title: "All blogs",
      blogs,
      page: page + 1,
    });
  });
};

const blogs_page = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const query = req.query.query || "";
  getBlogs(page, limit, query).then((blogs) =>
    res.render("partials/blog", { blogs })
  );
};

async function getBlogs(page, limit, title = "") {
  const offset = (page - 1) * limit;
  const filter = {};
  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }
  return await Blog.find(filter)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
}

const blog_create_post = (req, res) => {
  const blog = new Blog(req.body);
  blog.author = req.session.userId;
  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.error(err);
    });
};

const blog_details = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .populate({
      path: "comments",
      select: "comment",
      populate: { path: "author", select: "login" },
    })
    .exec()
    .then((result) => {
      const blogBody = marked.parse(result.body);
      res.render("blogs/details", {
        blog: result,
        blogBody,
        title: "Blog details",
      });
    })
    .catch((err) => {
      res.redirect("/404");
      console.error(err);
    });
};

const blog_create_get = (req, res) => {
  res.render("blogs/create", {
    title: "Create Blog",
    blog: {},
    formAction: "/blogs",
    errors: {},
    user: {
      isAdmin: req.session.isAdmin || "",
      isAutethicated: req.session.userId || "",
    },
  });
};

const blog_edit_get = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("blogs/create", {
        title: "Edit Blog",
        blog: result,
        errors: {},
        formAction: `/blogs/edit/${id}?_method=PUT`,
      });
    })
    .catch((err) => {
      res.redirect("/404");
      console.error(err);
    });
};

const blog_edit_put = (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.redirect(`/blogs/${req.params.id}`);
    })
    .catch((err) => res.status(500).send("Ошибка обновления поста"));
};

const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => res.json({ redirect: "/blogs" }))
    .catch((err) => {
      console.error(err);
    });
};

module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete,
  blog_edit_get,
  blog_edit_put,
  blogs_page,
};
