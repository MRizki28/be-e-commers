import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";

interface HttpResponse {
    message: string;
    data?: any;
    errors?: any;
    status?: string;
}

export class HttpResponseTraits {
    static success(payload: any = null, message: string = 'success'): HttpResponse {
        return {
            status: 'success',
            message: message,
            data: payload
        };
    }

    static dataNotFound(message: string = 'Data not found'): HttpResponse {
        throw new NotFoundException({
            status: 'not found',
            message: message
        })
    }

    static delete(message: string = 'Success delete', status: string = 'success'): HttpResponse {
        return {
            status: status,
            message: message
        };
    }

    static errorMessage(message: any = 'Error Server', code: number = 400): HttpResponse {
        throw new UnprocessableEntityException({
            status: "not validate",
            message: message,
        })
    }

    // static error(message: string = 'error', code: number = 400, payload: any = null, className: string | null = null, methodName: string = ''): HttpResponse {
    //     const data: HttpResponse = {
    //         code: code,
    //         message: message
    //     };

    //     if (payload) {
    //         console.error(className, {
    //             'Message: ' + payload.message,
    //             'Method: ' + methodName,
    //             'On File: ' + payload.fileName,
    //             'On Line: ' + payload.lineNumber
    //         });
    //     }

    //     return data;
    // }
}