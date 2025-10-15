import { Router } from 'express';
import { findAll, findOne, update, remove, create } from './medic.controller.js';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware.js';
import { validateInput } from '../../../shared/middlewares/validateInput.js';
import { medicSchema } from '../../../shared/schemas/userSchemas.js';
import { getMedicSchedule } from "./medic.controller.js";

export const routerMedic = Router();

routerMedic.get('/findAll', authMiddleware, validateInput({ location: 'body', schema: medicSchema }), findAll);
routerMedic.get('/findOne/:id', authMiddleware, validateInput({ location: 'params', schema: medicSchema }), findOne);
routerMedic.post('/update/:id', authMiddleware, validateInput({ location: 'body', schema: medicSchema }), update);
routerMedic.post('/create', authMiddleware, validateInput({ location: 'body', schema: medicSchema }), create);
routerMedic.delete('/remove/:id', authMiddleware, validateInput({ location: 'params', schema: medicSchema }), remove);
routerMedic.get('/schedule/:id', getMedicSchedule);

