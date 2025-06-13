import { Router } from "express";
import { findAll, findOne, update, remove, create, sanitizeInputAdmin } from "./administrative.controller.js";
export const routerAdmin = Router();

routerAdmin.get('/findAll', findAll);
routerAdmin.get('/findOne/:id', findOne);
routerAdmin.post('/update/:id', sanitizeInputAdmin, update);
routerAdmin.post('/create', sanitizeInputAdmin, create);
routerAdmin.delete('/remove/:id', remove);