import { Router } from "express";
import { findOne, findAll, remove, create, update } from "./appointment.controller.js";

export const appointmentRouter = Router();

appointmentRouter.get("/findAll", findAll);
appointmentRouter.get("/findOne/:id", findOne);
appointmentRouter.post("/create", create);
appointmentRouter.post("/update/:id", update);
appointmentRouter.delete("/remove/:id", remove);

export default appointmentRouter;
