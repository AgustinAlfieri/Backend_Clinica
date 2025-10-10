import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './practice.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { validateInput } from '../shared/middlewares/validateInput.js';
import { practiceSchema } from '../shared/schemas/userSchemas.js';

export const practiceRouter = Router();

practiceRouter.get('/findAll', authMiddleware, validateInput({ location: 'body', schema: practiceSchema }), findAll);
practiceRouter.get(
  '/findOne/:id',
  authMiddleware,
  validateInput({ location: 'body', schema: practiceSchema }),
  findOne
);
practiceRouter.post('/update/:id', authMiddleware, validateInput({ location: 'body', schema: practiceSchema }), update);
practiceRouter.post('/create', authMiddleware, validateInput({ location: 'body', schema: practiceSchema }), create);
practiceRouter.delete(
  '/remove/:id',
  authMiddleware,
  validateInput({ location: 'body', schema: practiceSchema }),
  remove
);
