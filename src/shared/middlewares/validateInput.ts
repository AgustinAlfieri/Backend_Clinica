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

      const result = await schema?.validateAsync(dataToValidate, { stripUnknown: true });

      req[location || 'body'] = result;

      next();
    } catch (err) {
      logger.error(err);

      const error = err as ValidationError;

      const errors = error.details.map((detail) => detail.message);
      ResponseManager.badRequest(res, errors, 'Error de validación', 400);
    }
  };
}
