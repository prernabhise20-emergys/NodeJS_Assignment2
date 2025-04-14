import express from 'express';
import dotenv from 'dotenv';
import registerRoutes from './src/routesRegister/routesRegister.js';
import cors from 'cors';
import errorHandler from './src/middlewares/errorHandler.js';
import helmet from 'helmet';
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from './swagger.js';
dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors(corsOptions));
registerRoutes(app);
app.use(errorHandler);


const { env: { PORT } } = process;
const port = PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
