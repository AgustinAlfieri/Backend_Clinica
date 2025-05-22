import { Router } from "express";
import { findAll, findOne, update, remove, create, sanitizeInputMedic } from "./medic.controller.js";

export const routerMedic = Router();

routerMedic.get('/findAll', findAll);
routerMedic.get('/findOne/:id', findOne);
routerMedic.post('/update/:id', sanitizeInputMedic, update);
routerMedic.post('/create', sanitizeInputMedic, create);
routerMedic.delete('/remove/:id', remove);