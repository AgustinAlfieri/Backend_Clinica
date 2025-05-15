import { Router } from "express";
import { findAll, findOne, update, remove, create, sanitizeInputPatient } from "./patient.controller.js";

export const patientRouter = Router();

patientRouter.get('/findAll', findAll);
patientRouter.get('/findOne/:id', findOne);
patientRouter.post('/create', sanitizeInputPatient, create);
patientRouter.post('/update/:id', sanitizeInputPatient, update);
patientRouter.delete('/remove/:id', remove);
