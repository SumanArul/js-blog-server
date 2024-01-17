const pool = require("../db.connection");

exports.getProfile = async (req, res) => {
  try {
    const profileQuery = `
      SELECT js_blog.User.id AS userId,
             js_blog.User.username,
             js_blog.User.email,
             js_blog.Blog.id AS postId,
             js_blog.Blog.title AS postTitle,
             js_blog.Blog.content AS postContent,
             js_blog.Blog.category AS postCategory,
             js_blog.Blog.tags AS postTags,
             js_blog.Blog.slug AS postSlug,
             js_blog.Blog.is_published AS isPostPublished,
             js_blog.Blog.published_at AS postPublishedAt
      FROM js_blog.User
      LEFT JOIN js_blog.Blog ON js_blog.User.id = js_blog.Blog.author_id
      GROUP BY userId, postId;
    `;

    pool.query(profileQuery, (err, results) => {
      if (err) {
        console.error("Error fetching profiles:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const profiles = [];
      let currentUser = null;

      results.forEach((result) => {
        if (!currentUser || currentUser.userId !== result.userId) {
          currentUser = {
            userId: result.userId,
            username: result.username,
            email: result.email,
            posts: [],
          };
          profiles.push(currentUser);
        }

        if (result.postId) {
          currentUser.posts.push({
            id: result.postId,
            title: result.postTitle,
            content: result.postContent,
            category: result.postCategory,
            tags: result.postTags,
            slug: result.postSlug,
            is_published: result.isPostPublished,
            published_at: result.postPublishedAt,
          });
        }
      });

      res.status(200).json(profiles);
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
