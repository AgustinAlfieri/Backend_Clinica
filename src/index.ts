import 'reflect-metadata';
import express from 'express';
import { orm, syncSchema } from './shared/database/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { errorHandler } from './shared/middlewares/errorHandler.js';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

const initApp = async () => {
  const routes = await import('./shared/routes.js');
  app.use(errorHandler);
  routes.default(app);
}

initApp();

// Add this line to include the appointmentStatus routes
await syncSchema(); // Never in production

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
