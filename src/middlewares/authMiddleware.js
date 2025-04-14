import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
import {
  ERROR_STATUS_CODE,
  ERROR_MESSAGE,
} from "../common/constants/statusConstant.js";

const authenticateUser = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(ERROR_STATUS_CODE.INVALID).json({
        status: ERROR_STATUS_CODE.INVALID,
        message: ERROR_MESSAGE.INVALID_TOKEN_MESSAGE,
      });
    }
    
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(ERROR_STATUS_CODE.FORBIDDEN).json({
        status: ERROR_STATUS_CODE.FORBIDDEN,
        message: ERROR_MESSAGE.FORBIDDEN_ERROR_MESSAGE,
      });
    }


    req.user = decoded;
console.log(req.user);

    next();
  } catch (error) {
    console.log("Decoded error:", error);

    res.status(ERROR_STATUS_CODE.INVALID).json({
      status: ERROR_STATUS_CODE.INVALID,
      message: ERROR_MESSAGE.INVALID_TOKEN_MESSAGE,
    });
  }
};


export default authenticateUser;
