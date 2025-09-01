import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cloudinary from "cloudinary";
import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import solutionRoutes from './routes/solutionRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import connectDB from './config/db.js';


dotenv.config();
connectDB();



const PORT = process.env.PORT || 4000;

const app = express();

app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(fileUpload());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});




app.use('/auth', authRoutes);
app.use('/problems', problemRoutes);
app.use('/solutions', solutionRoutes);
app.use('/comments', commentRoutes);
app.use('/votes', voteRoutes);


app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

