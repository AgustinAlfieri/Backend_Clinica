import { Request, Response } from 'express';
import * as authService from './auth.service.js';

export async function login(req: Request, res: Response) {
  try {
        const credentials : authService.userCredentials = req.body;
        const result = await authService.login(credentials);
        
        res.status(200).send(result);
  } catch(error) {
        res.status(500).json({ message: 'Error en el servidor' });
  }
}

export async function register(req: Request, res: Response) {
    try{
        const dataNewUser : authService.DataNewUser = req.body;
        const result = await authService.register(dataNewUser);

        res.status(201).send(result);
    } catch(error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
}
