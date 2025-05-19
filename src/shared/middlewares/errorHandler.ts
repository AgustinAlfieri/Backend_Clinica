import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errorManagment/appError.js';
import { logger } from '../logger/logger.js';

export function errorHandler( err: Error, req: Request, res: Response, next: NextFunction){
    const appError = err instanceof AppError;
    const statusCode = appError ? err.statusCode : 500;
    const messageError = appError ? err.messageError : 'Internal Server Error';

    logger.error("Error en: ${messageError}");

    res.status(statusCode).json({
        statusCode,
        messageError,
    });
}

