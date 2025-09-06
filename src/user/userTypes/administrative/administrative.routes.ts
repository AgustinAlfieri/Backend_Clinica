import { Router } from "express";
import { findAll, findOne,create,update,remove} from "./administrative.controller.js";

export const administrativeRouter = Router();

administrativeRouter.get('/findAll', findAll);
administrativeRouter.get('/findOne/:id', findOne);
administrativeRouter.post('/update/:id', update);
administrativeRouter.post('/create', create);
administrativeRouter.delete('/remove/:id', remove);