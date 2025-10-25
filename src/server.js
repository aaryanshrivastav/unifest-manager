import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import volRoutes from './routes/volunteerRoutes.js'
import coordRoutes from './routes/coordinatorRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/volunteer',volRoutes);
app.use('/coordinator',coordRoutes);
app.use('/faculty',facultyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
