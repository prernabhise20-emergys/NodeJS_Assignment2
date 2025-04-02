import userRouter from '../routes/userRoutes.js';
import patientRouter from '../routes/patientRoutes.js';
import adminRouter from '../routes/adminRoutes.js';
import doctorRouter from '../routes/doctorRoutes.js';
import ROUTE_CONSTANT from "../common/constants/routeConstant.js";
import { RouteHandler } from "../common/utility/handlers.js";

const { USER, PATIENT,ADMIN,DOCTOR } = ROUTE_CONSTANT;

export const routes = [
    new RouteHandler(USER, userRouter),
    new RouteHandler(PATIENT, patientRouter),
    new RouteHandler(ADMIN,adminRouter),
    new RouteHandler(DOCTOR,doctorRouter)
];
