import express from 'express'
import testRoutes from './Routes/testRoutes.js'
import dotenv from 'dotenv'
import connectDb from './DbConfig/connection.js'

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use('/api/test',testRoutes);

app.use('/api/home/:id', (req,res) => {
  res.send("Hii");
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});