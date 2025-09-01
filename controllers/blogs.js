const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id).populate("user");
  if (!blog) {
    response.status(404).json({ error: "No blog found with the given ID." });
    return;
  }
  response.json(blog);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "Token missing or invalid" });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  });
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: "Token missing or invalid" });
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    response.status(404).json({ error: "No blog found with the given ID." });
    return;
  }
  if (blog.user.toString() !== user.id.toString()) {
    response.status(401).json({ error: "Only user has been create blog can delete it." });
    return;
  }
  await Blog.findByIdAndDelete(id);
  response.status(204).end();
}
);

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { likes } = request.body;
  if (typeof likes !== "number" || likes < 0) {
    response.status(400).json({ error: "Likes must be non-negative number." });
    return;
  }
  const res = await Blog.findByIdAndUpdate(id, { likes }, { new: true });
  if (!res) {
    response.status(404).json({ error: "No blog found with the given ID." });
    return;
  }
  response.json(res);
});

module.exports = blogsRouter;
