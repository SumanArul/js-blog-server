const pool = require("../db.connection");

exports.createNewBlogPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const authorId = req.user.userId;
    console.log(req.user);
    const query =
      "INSERT INTO js_blog.Blog (title, content, author_id, category, tags, slug) VALUES (?, ?, ?, ?, ?, ?)";

    pool.query(
      query,
      [
        title,
        content,
        authorId,
        category,
        tags,
        title.toLowerCase().replace(/ /g, "-"),
      ],
      async (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res
          .status(201)
          .json({ message: "Blog post created successfully" });
      }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogsQuery = `
        SELECT js_blog.Blog.*, js_blog.User.id AS authorId, js_blog.User.username AS authorUsername, js_blog.User.email AS authorEmail
        FROM js_blog.Blog
        INNER JOIN js_blog.User ON js_blog.Blog.author_id = js_blog.User.id
      `;

    pool.query(blogsQuery, [], (err, results) => {
      if (err) {
        console.error("Error fetching blogs:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const blogs = results;

      res.status(200).json(blogs);
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const blogQuery = `
        SELECT js_blog.Blog.*, js_blog.User.id AS authorId, js_blog.User.username AS authorUsername, js_blog.User.email AS authorEmail
        FROM js_blog.Blog
        INNER JOIN js_blog.User ON js_blog.Blog.author_id = js_blog.User.id
        WHERE js_blog.Blog.id = ?
      `;

    pool.query(blogQuery, [id], (err, results) => {
      if (err) {
        console.error("Error fetching blog post:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const blog = results[0];

      if (!blog) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.status(200).json(blog);
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
