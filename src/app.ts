import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import issuesRoutes from './modules/issues/issues.routes';
import userRoutes from './modules/user/user.routes';
import { errorHandler } from './middleware/errorHandler';
import config from './config';

const app = express();
const corsOptions: cors.CorsOptions = {
	origin: (config as any).corsOrigin || '*',
	methods: (process.env.CORS_ALLOWED_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE').split(','),
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());




app.use('/api/auth', authRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
	res.json({ success: true, message: 'DevPulse project is ready' });
});

app.use(errorHandler);

export default app;