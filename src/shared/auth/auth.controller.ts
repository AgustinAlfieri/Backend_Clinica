import { Request, Response } from 'express';
import * as authService from './auth.service.js';
import { StatusCodes } from "http-status-codes";
import {logger} from '../logger/logger.js';
import { ResponseManager } from '../helpers/responseHelper.js';
import { resolveMessage } from '../errorManagment/appError.js';

export async function login(req: Request, res: Response) {
  try {
        const credentials : authService.userCredentials = req.body;
        const result = await authService.login(credentials);
        
        ResponseManager.success(res, result, 'Inicio de Sesión exitoso', StatusCodes.OK);
  } catch(error) {
        logger.error('Error en login:', error);

        //Me fijo si es uno o otro para devolver el codigo correcto
        const message = resolveMessage(error);

        if(message.includes('Invalid')) ResponseManager.unauthorized(res, message, StatusCodes.UNAUTHORIZED);
        else ResponseManager.error(res, message, message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function register(req: Request, res: Response) {
    try{
        const dataNewUser : authService.DataNewUser = req.body;
        const result = await authService.register(dataNewUser);

        ResponseManager.success(res, result, 'Usuario registrado exitosamente', StatusCodes.CREATED);
    } catch(error) {
        logger.error('Error en register:', error);
        
        const message = resolveMessage(error);
        ResponseManager.error(res, message, message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
