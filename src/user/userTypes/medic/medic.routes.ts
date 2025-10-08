import { Router } from 'express';
import { findAll, findOne, update, remove, create } from './medic.controller.js';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware.js';
import { validateAfterAuth } from '../../../shared/middlewares/validateInput.js';
import { medicSchema } from '../../../shared/schemas/userSchemas.js';

export const routerMedic = Router();

routerMedic.get('/findAll', authMiddleware, validateAfterAuth({ location: 'body', schema: medicSchema }), findAll);
routerMedic.get('/findOne/:id', authMiddleware, validateAfterAuth({ location: 'params', schema: medicSchema }), findOne);
routerMedic.post('/update/:id', authMiddleware, validateAfterAuth({ location: 'body', schema: medicSchema }), update);
routerMedic.post('/create', authMiddleware, validateAfterAuth({ location: 'body', schema: medicSchema }), create);
routerMedic.delete('/remove/:id', authMiddleware, validateAfterAuth({ location: 'params', schema: medicSchema }), remove);
