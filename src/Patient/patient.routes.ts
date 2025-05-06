import { Router } from "express";
import { sanitizePatientInput,  findAll, findOne, add, update, remove } from "./patient.controller.js";

export const patientRouter = Router()

patientRouter.get('/', findAll)
patientRouter.get('/:id', findOne)
patientRouter.post('/', sanitizePatientInput, add)
patientRouter.put('/:id', sanitizePatientInput, update)
patientRouter.patch('/:id', sanitizePatientInput, update)
patientRouter.delete('/:id', remove)