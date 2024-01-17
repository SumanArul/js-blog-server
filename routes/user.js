const { getProfile } = require("../controller/user");
const userRouter = require("express").Router();

userRouter.get("/:id", getProfile);

module.exports = userRouter;
