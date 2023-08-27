const res = require("express/lib/response");
const { getUserById } = require("../services/userService");

const isAuthorized = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await getUserById(userId);
    if (!user) throw new Error("User does not exist");

    if (user.role === "counter")
      throw new Error("User does not have enough privileges");

    next();
  } catch (e) {
    res.status(401).send({ err: true, msg: "Not authorized!" });
  }
};

module.exports = isAuthorized;
