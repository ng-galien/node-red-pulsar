import * as fs from "node:fs";
import axios from 'axios';

type TokenFile = {
    file: string
}
type TokenEnv = {
    env: string
}
type TokenUrl = {
    url: string
}
type TokenString = {
    string: string
}
export type Token = TokenFile | TokenEnv | TokenUrl | TokenString

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
    } else if (token.startsWith('http://') || token.startsWith('https://')) {
        return {url: token}
    } else {
        return {string: token}
    }
}

/**
 * Loads the token from the given Token object.
 *
 * @param {Token} token - The Token object.
 * @return {string} - The token string.
 */
export async function loadToken(token: Token): Promise<string> {
    if ((token as TokenFile).file) {
        return fs.readFileSync((token as TokenFile).file, 'utf8')
    } else if ((token as TokenEnv).env) {
        return process.env[(token as TokenEnv).env] || ''
    } else if ((token as TokenUrl).url) {
        const response = await axios.get((token as TokenUrl).url).then(response => response.data)
        return response.toString()
    } else {
        return (token as TokenString).string
    }
}
