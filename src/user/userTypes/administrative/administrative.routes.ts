import { Router } from "express";
import { findAll, findOne,create,update,remove} from "./administrative.controller.js";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware.js";
import { validateAfterAuth } from "../../../shared/middlewares/validateInput.js";
import { administrativeSchema } from "../../../shared/schemas/userSchemas.js";  

export const administrativeRouter = Router();

administrativeRouter.get('/findAll', authMiddleware, validateAfterAuth({ location: 'body', schema: administrativeSchema }), findAll);
administrativeRouter.get('/findOne/:id', authMiddleware, validateAfterAuth({ location: 'params', schema: administrativeSchema }), findOne);
administrativeRouter.post('/update/:id', authMiddleware, validateAfterAuth({ location: 'body', schema: administrativeSchema }), update);
administrativeRouter.post('/create', authMiddleware, validateAfterAuth({ location: 'body', schema: administrativeSchema }), create);
administrativeRouter.delete('/remove/:id', authMiddleware, validateAfterAuth({ location: 'params', schema: administrativeSchema }), remove);