import { Router } from "express";
import {findAll, findOne,create,update,remove} from "./practice.controller.js";

export const practiceRouter = Router();

practiceRouter.get('/findAll', findAll);
practiceRouter.get('/findOne/:id', findOne);
practiceRouter.post('/update/:id', update);
practiceRouter.post('/create', create);
practiceRouter.delete('/remove/:id', remove);