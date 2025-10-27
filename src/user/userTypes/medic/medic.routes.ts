import { Router } from 'express';
import { findAll, findOne, update, remove, create } from './medic.controller.js';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware.js';
import { validateInput } from '../../../shared/middlewares/validateInput.js';
import { medicSchema } from '../../../shared/schemas/userSchemas.js';
import { getMedicSchedule } from './medic.controller.js';

export const routerMedic = Router();

routerMedic.get(
  '/findAll',
  authMiddleware('Medic', 'view'),
  validateInput({ location: 'body', schema: medicSchema }),
  findAll
);
routerMedic.get(
  '/findOne/:id',
  authMiddleware('Medic', 'view'),
  validateInput({ location: 'params', schema: medicSchema }),
  findOne
);
routerMedic.post(
  '/update/:id',
  authMiddleware('Medic', 'update'),
  validateInput({ location: 'body', schema: medicSchema }),
  update
);
routerMedic.post(
  '/create',
  authMiddleware('Medic', 'create'),
  validateInput({ location: 'body', schema: medicSchema }),
  create
);
routerMedic.delete(
  '/remove/:id',
  authMiddleware('Medic', 'delete'),
  validateInput({ location: 'params', schema: medicSchema }),
  remove
);
routerMedic.get('/schedule/:id', authMiddleware('Medic', 'view'), getMedicSchedule);
