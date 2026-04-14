import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import passwordRoutes from './routes/passwordRoutes';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('API is running... (TypeScript Strict Mode)');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/password', passwordRoutes);

app.listen(PORT, () => {
    console.log(`🚀 System Design Architecture: Server gracefully running on port ${PORT} [TypeScript]`);
});
