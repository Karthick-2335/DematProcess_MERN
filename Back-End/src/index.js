import express from 'express'
import testRoutes from './Routes/testRoutes.js'
import masterRoutes from './Routes/masterRoutes.js'
import kycRoutes from './Routes/kycRoutes.js'
import dotenv from 'dotenv'
import connectDb from './DbConfig/connection.js'
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT;
app.use(express.json());

app.use('/api/test',testRoutes);
app.use('/api/master',masterRoutes)
app.use('/api/kyc',kycRoutes)

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});