import { Router } from "express";
import { findAll, findOne, update, create, remove } from "./patient.controller.js";
import { checkPermissionMiddleware } from "../../../shared/middlewares/checkPermissionMiddleware.js";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware.js";
import { Role } from "../../../shared/enums/role.enum.js";
import { actions } from "../../../shared/permission/rolesPermission.js";

export const patientRouter = Router();

patientRouter.get('/findAll', authMiddleware, checkPermissionMiddleware( Role.PATIENT, actions.VIEW), findAll);
patientRouter.get('/findOne/:id', authMiddleware, checkPermissionMiddleware(Role.PATIENT, actions.VIEW), findOne);
patientRouter.post('/create', authMiddleware, checkPermissionMiddleware(Role.PATIENT, actions.CREATE), create);
patientRouter.post('/update/:id', authMiddleware, checkPermissionMiddleware(Role.PATIENT, actions.UPDATE), update);
patientRouter.delete('/remove/:id', authMiddleware, checkPermissionMiddleware(Role.PATIENT, actions.DELETE), remove);
