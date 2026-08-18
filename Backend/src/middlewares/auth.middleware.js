import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import blackListModel from "../models/blackList.model.js";

async function authUser(req, res, next) {
  try {
    const token =
      req.cookies.refreshToken ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization);

    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized User, please login first" });

    const isRefreshTokenBlackList = await blackListModel.findOne({
      refreshToken: token,
    });
    if (isRefreshTokenBlackList) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user)
      return res
        .status(401)
        .json({ message: "Unauthorized user or User not Found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

export default authUser;
