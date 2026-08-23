import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter
    implements ExceptionFilter
{
    private readonly logger =
        new Logger(HttpExceptionFilter.name);

    catch(
        exception: unknown,
        host: ArgumentsHost,
    ) {
        const context =
            host.switchToHttp();

        const response =
            context.getResponse<Response>();

        const request =
            context.getRequest<Request>();

        let status = 500;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const exceptionResponse =
                exception.getResponse();

            if (
                typeof exceptionResponse === 'string'
            ) {
                message = exceptionResponse;
            } else if (
                typeof exceptionResponse === 'object' &&
                exceptionResponse !== null &&
                'message' in exceptionResponse
            ) {
                message = String(
                    exceptionResponse.message,
                );
            }
        }

        this.logger.error(
            `${request.method} ${request.url}`,
            exception instanceof Error
                ? exception.stack
                : String(exception),
        );

        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}