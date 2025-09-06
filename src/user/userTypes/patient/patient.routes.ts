import { Router } from "express";
import { findAll, findOne, update, create, remove } from "./patient.controller.js";

export const patientRouter = Router();

patientRouter.get('/findAll', findAll);
patientRouter.get('/findOne/:id', findOne);
patientRouter.post('/create', create);
patientRouter.post('/update/:id', update);
patientRouter.delete('/remove/:id', remove);
