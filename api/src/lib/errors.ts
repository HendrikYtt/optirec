export class BaseError {
    constructor(public status: number, public message: string, public details?: unknown) {}
}

export class BadRequestError extends BaseError {
    constructor(message: string, details?: unknown) {
        super(400, message, details);
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message = 'UnauthorizedError', details?: unknown) {
        super(401, message, details);
    }
}

export class ForbiddenError extends BaseError {
    constructor(message = 'ForbiddenError', details?: unknown) {
        super(403, message, details);
    }
}

export class NotFoundError extends BaseError {
    constructor(message = 'NotFoundError', details?: unknown) {
        super(404, message, details);
    }
}
