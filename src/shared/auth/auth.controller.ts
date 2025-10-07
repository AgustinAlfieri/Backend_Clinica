import { Request, Response } from 'express';
import * as authService from './auth.service.js';
import { StatusCodes } from "http-status-codes";
import {logger} from '../logger/logger.js';

export async function login(req: Request, res: Response) {
  try {
        const credentials : authService.userCredentials = req.body;

        // Validation credentials could be added here or in a middleware
   //         if (
     //         !credentials.email ||
       //       !credentials.password ||
         //     !credentials.role
           // ) {
         //     res.status(StatusCodes.BAD_REQUEST).json({
          //      message: "Email, password y role son requeridos",
        //      });
            //  return;
         //   }
        const result = await authService.login(credentials);
        
        //res.status(200).send(result);
        // Por qué deberia enviar un json?
        res.status(200).json({
            success: true,
            message: 'Login successful',
            ...result
            });
  } catch(error) {
        logger.error('Error en login:', error);
        // Managment of different error types could be added here
        const message = (error instanceof Error) ? error.message : 'Error en el servidor';
        const statusCode = message.includes('Invalid') ? StatusCodes.UNAUTHORIZED : StatusCodes.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ 
            success: false,
            message
         });
  }
}

export async function register(req: Request, res: Response) {
    try{
        console.log("Llegue al controller");
        const dataNewUser : authService.DataNewUser = req.body;
//        if(!dataNewUser.name || !dataNewUser.email || !dataNewUser.password || !dataNewUser.role) {
//            res.status(400).json({ message: 'Faltan datos requeridos' });
//            return;
//        } Estas lineas estan silenciadas al pedo porque el error venia de que mandama el newUser sin Name sino con NOMBRE
        const result = await authService.register(dataNewUser);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'User registered successfully',
            ...result
        });
    } catch(error) {
        logger.error('Error en register:', error);
        const message = (error instanceof Error) ? error.message : 'Error en el servidor';
        const statusCode = message.includes('exists') 
        ? StatusCodes.CONFLICT 
        : StatusCodes.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ 
            success: false,
            message
         });
    }
}
