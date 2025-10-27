import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { orm, syncSchema } from './shared/database/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { errorHandler } from './shared/middlewares/errorHandler.js';

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-clinica-seven.vercel.app',
  'https://frontend-clinica-prod.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// RequestContext de MikroORM (después de CORS, antes de rutas)
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

const initApp = async () => {
  const routes = await import('./shared/routes.js');
  routes.default(app);
  app.use(errorHandler);
};

await syncSchema(); // ⚠️ solo en dev, nunca en producción
await initApp();

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
