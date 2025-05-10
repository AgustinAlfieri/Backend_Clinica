import { Router } from "express";
import { sanitizePatientInput, findAll, findOne, add, update, remove } from "./patient.controller.js";
export const patientRouter = Router();
patientRouter.get('/findAll', findAll);
patientRouter.get('/findOne/:id', findOne);
patientRouter.post('/add/', sanitizePatientInput, add);
patientRouter.put('/update/:id', sanitizePatientInput, update);
patientRouter.patch('/update/:id', sanitizePatientInput, update);
patientRouter.delete('/delete/:id', remove);
//# sourceMappingURL=patient.routes.js.map