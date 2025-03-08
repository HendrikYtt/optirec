export class TokenPayload {
    aud: string;
    exp: number;
    iat: number;
    iss: string;
    sub: number;

    constructor(aud: string, exp: number, iat: number, iss: string, sub: number) {
        this.aud = aud;
        this.exp = exp;
        this.iat = iat;
        this.iss = iss;
        this.sub = sub;
    }
}
