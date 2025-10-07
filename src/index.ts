import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { orm, syncSchema } from './shared/database/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { errorHandler } from './shared/middlewares/errorHandler.js';

const app = express();
app.use(express.json());

// 👉 CORS primero (antes que MikroORM y rutas)
app.use(
  cors({
    origin: '', // frontend de Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // si vas a mandar cookies/sesiones
  })
);

// 👉 RequestContext de MikroORM (después de CORS, antes de rutas)
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

const initApp = async () => {
  const routes = await import('./shared/routes.js');
  routes.default(app); // tus rutas
  app.use(errorHandler); // error handler al final
};

await syncSchema(); // ⚠️ solo en dev, nunca en producción
await initApp();

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
