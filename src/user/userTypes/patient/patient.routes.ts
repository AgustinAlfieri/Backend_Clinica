import { Router } from "express";
import { findAll, findOne, update, create, remove } from "./patient.controller.js";
import { checkPermissionMiddleware } from "../../../shared/middlewares/checkPermissionMiddleware.js";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware.js";

export const patientRouter = Router();

patientRouter.get('/findAll', authMiddleware, checkPermissionMiddleware('Patient', 'view'), findAll);
patientRouter.get('/findOne/:id', authMiddleware, checkPermissionMiddleware('Patient', 'view'), findOne);
patientRouter.post('/create', authMiddleware, checkPermissionMiddleware('Patient', 'create'), create);
patientRouter.post('/update/:id', authMiddleware, checkPermissionMiddleware('Patient', 'update'), update);
patientRouter.delete('/remove/:id', authMiddleware, checkPermissionMiddleware('Patient', 'delete'), remove);
