import * as fs from 'node:fs';

type TokenFile = {
  file: string;
};
type TokenEnv = {
  env: string;
};
type TokenString = {
  string: string;
};
export type Token = TokenFile | TokenEnv | TokenString;

/**
 * Parses the given token and returns a Token object based on its type.
 *
 * @param {string} token - The token to be parsed.
 * @return {Token} - The parsed Token object.
 */
export function parseToken(token: string): Token {
  if (token.startsWith('file://')) {
    return { file: token.substring(7) };
  } else if (token.startsWith('env:')) {
    return { env: token.substring(4) };
  } else {
    return { string: token };
  }
}

/**
 * Loads the token from the given Token object.
 *
 * @param {Token} token - The Token object.
 * @param {(error: string) => void} errorHandler - The error handler function.
 * @return {string} - The token string.
 */
export function loadToken(
  token: Token,
  errorHandler: (error: string) => void,
): string | undefined {
  try {
    if ((token as TokenFile).file) {
      return fs.readFileSync((token as TokenFile).file, 'utf8');
    } else if ((token as TokenEnv).env) {
      return process.env[(token as TokenEnv).env] || '';
    } else {
      return (token as TokenString).string;
    }
  } catch (error) {
    errorHandler(`Error loading token: ${error}`);
    return undefined;
  }
}

/**
 * Token supplier type that can be used with AuthenticationToken.
 * Supports sync functions, async functions, or static strings.
 */
export type TokenSupplier = string | (() => string) | (() => Promise<string>);

/**
 * Creates a token supplier function for dynamic token loading.
 * For file:// and env: sources, returns a function that re-reads the value each time.
 * For static strings, returns the string directly.
 *
 * @param {Token} token - The Token object.
 * @param {(error: string) => void} errorHandler - The error handler function.
 * @return {TokenSupplier | undefined} - A token supplier or undefined on error.
 */
export function createTokenSupplier(
  token: Token,
  errorHandler: (error: string) => void,
): TokenSupplier | undefined {
  if ((token as TokenFile).file) {
    const filePath = (token as TokenFile).file;
    // Validate file exists on initial call
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
    } catch (error) {
      errorHandler(`Token file not accessible: ${filePath}`);
      return undefined;
    }
    // Return supplier that re-reads file on each call
    return (): string => {
      try {
        return fs.readFileSync(filePath, 'utf8').trim();
      } catch (error) {
        errorHandler(`Error reading token file: ${error}`);
        return '';
      }
    };
  } else if ((token as TokenEnv).env) {
    const envVar = (token as TokenEnv).env;
    // Validate env var exists on initial call
    if (!process.env[envVar]) {
      errorHandler(`Environment variable not set: ${envVar}`);
      return undefined;
    }
    // Return supplier that re-reads env var on each call
    return (): string => {
      return process.env[envVar] || '';
    };
  } else {
    // Static string - return directly (no need for supplier)
    return (token as TokenString).string;
  }
}
