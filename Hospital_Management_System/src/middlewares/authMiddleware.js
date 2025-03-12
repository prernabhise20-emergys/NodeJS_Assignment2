import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
import { MESSAGE, STATUS_CODE } from "../common/constants/statusConstant.js";

const authenticateUser = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(STATUS_CODE.INVALID).json({
        status: STATUS_CODE.INVALID,
        message: MESSAGE.INVALID_TOKEN_MESSAGE,
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);

    if (!decoded) {
      if (err) {
        return res.status(STATUS_CODE.FORBIDDEN).json({
          status: STATUS_CODE.FORBIDDEN,
          message: MESSAGE.FORBIDDEN_ERROR_MESSAGE,
        });
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(STATUS_CODE.INVALID).json({
      status: STATUS_CODE.INVALID,
      message: MESSAGE.INVALID_TOKEN_MESSAGE,
    });
  }
};

export default authenticateUser;
