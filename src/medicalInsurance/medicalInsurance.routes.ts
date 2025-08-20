import { Router } from "express";
import {sanitizeInputMedicalInsurance, findAll, findOne,create,update,remove} from "./medicalInsurance.controller.js";


export const medicalInsuranceRouter = Router();

medicalInsuranceRouter.get('/findAll', findAll);
medicalInsuranceRouter.get('/findOne/:id', findOne);
medicalInsuranceRouter.post('/update/:id', sanitizeInputMedicalInsurance, update);
medicalInsuranceRouter.post('/create', sanitizeInputMedicalInsurance, create);
medicalInsuranceRouter.delete('/remove/:id', remove);