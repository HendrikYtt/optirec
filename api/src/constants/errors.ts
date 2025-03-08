export enum AuthError {
    EmailAlreadyExists = 'Email already exists!',
    Unauthorized = 'Invalid email or password',
    IncorrectOldPassword = 'Provided old password is incorrect',
    PasswordsMustBeDifferent = 'New password must be different from old password',
}

export enum ApplicationError {
    ApplicationNotFound = 'Application not found',
    ApiKeyNotFound = 'API key not found',
    ApplicationAlreadyExists = 'Application name already exists',
    ApplicationIdMustBeANumber = 'Application ID must be a number',
    ApplicationKeyIdMustBeANumber = 'Application key ID must be a number',
    ApplicationKeyNotFound = 'Application key not found',
    InvalidLastUsedAt = 'Invalid date used for last used at',
}

export enum ApiError {
    InvalidApiKey = 'Invalid API key',
    RequiresApiKey = 'API key must be provided',
}

export enum SessionError {
    SessionExpired = 'Session expired',
}
