import { Router } from "express";
import { findAll, findOne, update, remove, create } from "./medic.controller.js";

export const routerMedic = Router();

routerMedic.get('/findAll', findAll);
routerMedic.get('/findOne/:id', findOne);
routerMedic.post('/update/:id', update);
routerMedic.post('/create', create);
routerMedic.delete('/remove/:id', remove);