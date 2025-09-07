import { Router } from "express";
import { findAll, findOne,create,update,remove} from "./administrative.controller.js";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware.js";
import { checkPermissionMiddleware } from "../../../shared/middlewares/checkPermissionMiddleware.js";
import { Role } from "../../../shared/enums/role.enum.js";
import { actions } from "../../../shared/permission/rolesPermission.js";

export const administrativeRouter = Router();

administrativeRouter.get('/findAll', authMiddleware, checkPermissionMiddleware(Role.ADMINISTRATIVE, actions.VIEW), findAll);
administrativeRouter.get('/findOne/:id', authMiddleware, checkPermissionMiddleware(Role.ADMINISTRATIVE, actions.VIEW), findOne);
administrativeRouter.post('/update/:id', authMiddleware, checkPermissionMiddleware(Role.ADMINISTRATIVE, actions.UPDATE), update);
administrativeRouter.post('/create', authMiddleware, checkPermissionMiddleware(Role.ADMINISTRATIVE, actions.CREATE), create);
administrativeRouter.delete('/remove/:id', authMiddleware, checkPermissionMiddleware(Role.ADMINISTRATIVE, actions.DELETE), remove);