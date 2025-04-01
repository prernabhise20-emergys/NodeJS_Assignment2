import {
    ERROR_MESSAGE,
    ERROR_STATUS_CODE,
} from "../common/constants/statusConstant.js";

const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
        status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
        message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
};

export default errorHandler;