const {
  createNewBlogPost,
  getAllBlogs,
  getBlogPostById,
} = require("../controller/blog");
const authenticateToken = require("../middleware/authToken");

const blogRouter = require("express").Router();

blogRouter.get("/", getAllBlogs);
blogRouter.post("/", authenticateToken, createNewBlogPost);
blogRouter.get("/:id", getBlogPostById);

module.exports = blogRouter;
