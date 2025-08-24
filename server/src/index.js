import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initDb } from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import storesRoutes from './routes/stores.routes.js';
import ownerRoutes from './routes/owner.routes.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('API running'));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/owner', ownerRoutes);

const start = async () => {
  await initDb();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server listening on ${port}`));
};

start();
