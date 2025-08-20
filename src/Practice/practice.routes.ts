import { Router } from "express";
import {sanitizeInputPractice, findAll, findOne,create,update,remove} from "./practice.controller.js";

export const practiceRouter = Router();

practiceRouter.get('/findAll', findAll);
practiceRouter.get('/findOne/:id', findOne);
practiceRouter.post('/update/:id', sanitizeInputPractice, update);
practiceRouter.post('/create', sanitizeInputPractice, create);
practiceRouter.delete('/remove/:id', remove);