import { Router } from 'express';
import { login, register } from './auth.controller.js';

export const authRouter = Router();

//Para iniciar sesion
authRouter.get('/login', login);

//Para crear nuevo usuario
authRouter.get('/register', register);