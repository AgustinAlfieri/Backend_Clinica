import { Router } from 'express';
import { findAll, findOne, update, remove, create } from './medic.controller.js';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware.js';
import { checkPermissionMiddleware } from '../../../shared/middlewares/checkPermissionMiddleware.js';
import { Role } from '../../../shared/enums/role.enum.js';
import { actions } from '../../../shared/permission/rolesPermission.js';

export const routerMedic = Router();

//routerMedic.get('/findAll', authMiddleware, checkPermissionMiddleware(Role.MEDIC, actions.VIEW), findAll);
//routerMedic.get('/findOne/:id', authMiddleware, checkPermissionMiddleware(Role.MEDIC, actions.VIEW), findOne);
//routerMedic.post('/update/:id', authMiddleware, checkPermissionMiddleware(Role.MEDIC, actions.UPDATE), update);
//routerMedic.post('/create', authMiddleware, checkPermissionMiddleware(Role.MEDIC, actions.CREATE), create);
//routerMedic.delete('/remove/:id', authMiddleware, checkPermissionMiddleware(Role.MEDIC, actions.DELETE), remove);

routerMedic.get('/findAll', authMiddleware, checkPermissionMiddleware(Role.MEDIC, actions.VIEW), findAll);
routerMedic.get('/findOne/:id', findOne);
routerMedic.post('/update/:id', authMiddleware, checkPermissionMiddleware(Role.MEDIC, actions.UPDATE), update);
routerMedic.post('/create', create);
routerMedic.delete('/remove/:id', authMiddleware, checkPermissionMiddleware(Role.MEDIC, actions.DELETE), remove);
