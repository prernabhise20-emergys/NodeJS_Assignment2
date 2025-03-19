import express from 'express'
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes.js';
import patientRoutes from './src/routes/patientRoutes.js';
import registerRoutes from './src/routesRegister/routesRegister.js'
import cors from 'cors'
import helmet from 'helmet';
dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/api/user", userRoutes).use("/api/patient", patientRoutes);
// registerRoutes(app);
const corsOptions = {
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

const { env: { PORT }, } = process;
const port = PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
