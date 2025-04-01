import userRouter from '../routes/userRoutes.js';
import patientRouter from '../routes/patientRoutes.js';
import adminRouter from '../routes/adminRoutes.js'
import ROUTE_CONSTANT from "../common/constants/routeConstant.js";
import { RouteHandler } from "../common/utility/handlers.js";

const { USER, PATIENT,ADMIN } = ROUTE_CONSTANT;

export const routes = [
    new RouteHandler(USER, userRouter),
    new RouteHandler(PATIENT, patientRouter),
    new RouteHandler(ADMIN,adminRouter)
];
