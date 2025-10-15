import { Router } from "express";
import { findOne, findAll, remove, create, update } from "./appointment.controller.js";
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { validateInput } from '../shared/middlewares/validateInput.js';
import { appointmentSchema } from '../shared/schemas/appointmentRelatedSchemas.js'


export const appointmentRouter = Router();

appointmentRouter.get("/findAll", authMiddleware, validateInput({ location: 'body', schema: appointmentSchema }), findAll);
appointmentRouter.get("/findOne/:id", authMiddleware, validateInput({ location: 'body', schema: appointmentSchema }), findOne);
appointmentRouter.post("/create", authMiddleware, validateInput({ location: 'body', schema: appointmentSchema }), create);
appointmentRouter.post("/update/:id", authMiddleware, validateInput({ location: 'body', schema: appointmentSchema }), update);
appointmentRouter.delete("/remove/:id", authMiddleware, validateInput({ location: 'body', schema: appointmentSchema }), remove);

export default appointmentRouter;
