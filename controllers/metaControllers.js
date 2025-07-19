const Comment = require("../models/comment");

const blog_like_post = async (req, res) => {
  const post = await Blog.findById(req.params.id);
  post.likes.has(req.session.userId)
    ? post.likes.delete(req.session.userId)
    : post.likes.set(req.session.userId, true);
  await post.save();
  res.json({ likes: post.likes.size });
};

const blog_comment_post = async (req, res) => {
  try {
    const blogId = req.query.id;
    const newComment = await new Comment({
      author: req.session.userId,
      comment: req.body.comment,
    });
    await newComment.save();
    await Blog.findByIdAndUpdate(blogId, {
      $push: { comments: newComment._id },
    });
    res.redirect(`/blogs/${blogId}`);
  } catch (err) {
    res.status(500).send("Ошибка добавления комментария");
  }
};

module.exports = { blog_comment_post, blog_like_post };
