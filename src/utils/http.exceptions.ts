interface ErrorParams {
	translation?: boolean;
}

export default class ApiError extends Error {
	public readonly statusCode: number
	public readonly options?: ErrorParams

	constructor(message: string, statusCode: number, options?: ErrorParams) {
		super(message)
		this.statusCode = statusCode
		this.options = options
	}
}

export class BadRequestError extends ApiError {
	constructor(message: string) {
		super(message, 400)
	}
}

export class NotFoundError extends ApiError {
	constructor(message: string) {
		super(message, 404)
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message: string) {
		super(message, 401)
	}
}

export class NotAcceptable extends ApiError {
	constructor(message: string) {
		super(message, 406)
	}
}
export class Forbidden extends ApiError {
	constructor(message: string) {
		super(message, 403)
	}
}