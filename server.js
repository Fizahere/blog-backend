import express from 'express';
import connectDb from './dbConnection/dbConnection.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();
const app = express();
connectDb();
const port = 2000;
app.use(express.json())
app.use('/api/auth-routes', authRoutes)
app.use('/api/post-routes', postRoutes)



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

