import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
import {
  ERROR_STATUS_CODE,
  ERROR_MESSAGE,
} from "../common/constants/statusConstant.js";

const authenticateUser = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(ERROR_STATUS_CODE.INVALID).json({
        status: ERROR_STATUS_CODE.INVALID,
        message: ERROR_MESSAGE.INVALID_TOKEN_MESSAGE,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);

    if (!decoded) {
      return res.status(ERROR_STATUS_CODE.FORBIDDEN).json({
        status: ERROR_STATUS_CODE.FORBIDDEN,
        message: ERROR_MESSAGE.FORBIDDEN_ERROR_MESSAGE,
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(ERROR_STATUS_CODE.INVALID).json({
      status: ERROR_STATUS_CODE.INVALID,
      message: ERROR_MESSAGE.INVALID_TOKEN_MESSAGE,
    });
  }
};

export default authenticateUser;
