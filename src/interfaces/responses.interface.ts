//Contains the responses interfaces
export const enum ResponseErrorCodes {
    'validation' = 5000,
    'common' = 5001,
}

export interface ResponseFunctionsParams {
    translation?: boolean | true;
    data?: object | null;
    status_code?: number;
}

export interface ResponseSucessParams extends ResponseFunctionsParams {
}

export interface ResponseErrorParams extends ResponseFunctionsParams {
    error_description?: string
    error?: object;
}

export const enum ResponseStatus { 'error' = 'error', 'success' = 'success' }

interface Response {
    status: ResponseStatus;
}

export interface ResponseError extends Response {
    error_description?: string;
    error?: object;
    error_code: number;
    message?: string[];
}

export interface ResponseSuccess extends Response {
    data?: object | null;
    message?: string;
}