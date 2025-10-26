import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationError } from 'joi';
import { logger } from '../logger/logger.js';
import { ResponseManager } from '../helpers/responseHelper.js';

interface validateInputProps {
  location?: 'body' | 'params' | 'query';
  schema?: Schema;
}

export function validateInput({ location, schema }: validateInputProps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[location || 'body'];
      
      // DEBUG: Ver qué llega antes de validar
      console.log('=== VALIDATE INPUT MIDDLEWARE DEBUG ===');
      console.log('location:', location);
      console.log('dataToValidate:', JSON.stringify(dataToValidate, null, 2));
      console.log('=======================================');
      
      const result = await schema?.validateAsync(dataToValidate, { stripUnknown: true });

      req[location || 'body'] = result;
      
      // DEBUG: Ver qué queda después de validar
      console.log('=== AFTER VALIDATION ===');
      console.log('result:', JSON.stringify(result, null, 2));
      console.log('========================');
      
      next();
    } catch (err) {
      logger.error(err);

      const error = err as ValidationError;

      const errors = error.details.map((detail) => detail.message);
      ResponseManager.badRequest(res, errors, 'Error de validación', 400);
    }
  };
}
