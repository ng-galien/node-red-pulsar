import * as fs from "node:fs";

type TokenFile = {
    file: string
}
type TokenEnv = {
    env: string
}
type TokenString = {
    string: string
}
export type Token = TokenFile | TokenEnv | TokenString

/**
 * Parses the given token and returns a Token object based on its type.
 *
 * @param {string} token - The token to be parsed.
 * @return {Token} - The parsed Token object.
 */
export function parseToken(token: string): Token {
    if (token.startsWith('file://')) {
        return {file: token.substring(7)}
    } else if (token.startsWith('env:')) {
        return {env: token.substring(4)}
    } else {
        return {string: token}
    }
}

/**
 * Loads the token from the given Token object.
 *
 * @param {Token} token - The Token object.
 * @param {(error: string) => void} errorHandler - The error handler function.
 * @return {string} - The token string.
 */
export function loadToken(token: Token, errorHandler: (error: string) => void): string | undefined {
    try {
        if ((token as TokenFile).file) {
            return fs.readFileSync((token as TokenFile).file, 'utf8')
        } else if ((token as TokenEnv).env) {
            return process.env[(token as TokenEnv).env] || ''
        } else {
            return (token as TokenString).string
        }
    } catch (error) {
        errorHandler(`Error loading token: ${error}`);
        return undefined;
    }
}
