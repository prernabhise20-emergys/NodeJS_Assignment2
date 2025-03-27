import express from 'express';
import dotenv from 'dotenv';
import registerRoutes from './src/routesRegister/routesRegister.js';
import cors from 'cors';
import helmet from 'helmet';
dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

registerRoutes(app);

// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).send({message:"error occurred"});
// });

const { env: { PORT } } = process;
const port = PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
