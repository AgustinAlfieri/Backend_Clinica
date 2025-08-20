import { Router } from "express";
import {sanitizeInputAdmin, findAll, findOne,create,update,remove} from "./administrative.controller.js";

export const administrativeRouter = Router();

administrativeRouter.get('/findAll', findAll);
administrativeRouter.get('/findOne/:id', findOne);
administrativeRouter.post('/update/:id', sanitizeInputAdmin, update);
administrativeRouter.post('/create', sanitizeInputAdmin, create);
administrativeRouter.delete('/remove/:id', remove);