interface ResponseManagerOutput {
    success: boolean;
    data?: any;
    message?: string;
    errors?: string[];
    statusCode: number;
}

export class ResponseManager {
    //Ayuda a no dejar codigo repetido en los controllers
    public static success(res: any, data: any, message: string = 'Operación exitosa', statusCode: number = 200) {
        const response: ResponseManagerOutput = {
            success: true,
            data,
            message,
            statusCode
        };

        return res.status(statusCode).json(response);
    };
    
    public static created(res: any, data: any, message: string = 'Recurso creado exitosamente', statusCode: number = 201) {
        const response: ResponseManagerOutput = {
            success: true,
            data,
            message,
            statusCode
        };

        return res.status(statusCode).json(response);
    }

    public static error(res: any, errors: string[] | string, message: string = 'Ocurrió un error', statusCode: number = 500) {
        const errorArray = Array.isArray(errors) ? errors : [errors];
        const response: ResponseManagerOutput = {
            success: false,
            errors: errorArray,
            message,
            statusCode
        };

        return res.status(statusCode).json(response);
    };

    public static notFound(res: any, message: string = 'Recurso no encontrado', statusCode: number = 404) {
        const response: ResponseManagerOutput = {
            success: false,
            message,
            statusCode
        };

        return res.status(statusCode).json(response);
    };

    public static badRequest(res: any, errors: string[] | string, message: string = 'Solicitud incorrecta', statusCode: number = 400) {
        const errorArray = Array.isArray(errors) ? errors : [errors];
        const response: ResponseManagerOutput = {
            success: false,
            errors: errorArray,
            message,
            statusCode
        };

        return res.status(statusCode).json(response);
    };

    public static unauthorized(res: any, message: string = 'No autorizado', statusCode: number = 401) {
        const response: ResponseManagerOutput = {
            success: false,
            message,
            statusCode
        };

        return res.status(statusCode).json(response);
    };
};