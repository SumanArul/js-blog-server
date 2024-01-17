const authRouter = require("./auth");
const blogRouter = require("./blog");
const userRouter = require("./user");

const router = require("express").Router();

router.get("/ping", (req, res) => {
  res.status(200).send("Pong...");
});

router.use("/auth", authRouter);
router.use("/blog", blogRouter);
router.use("/user", userRouter);

module.exports = router;
