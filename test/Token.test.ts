import { expect } from 'chai';
import {loadToken, parseToken, Token} from '../src/Token';
import * as fs from "node:fs";
import sinon from 'sinon';
import axios from 'axios';

describe('Token functions', function () {

    const envJwtToken = 'TestEnvValue';
    const fileJwtToken = 'TestFileContent';
    const httpJwtToken = 'TestUrlContent';

    before(function(){
        // setup environment variable for test
        process.env['my_env'] = envJwtToken;
        // setup file for test
        fs.writeFileSync('my_file', fileJwtToken, 'utf8');
        // setup http mock for test
        sinon.mock(axios).expects('get').twice().resolves({ data: httpJwtToken });
    });

    after(function() {
        delete process.env['my_env'];
        fs.unlinkSync('my_file');
        sinon.restore();
    });

    it('Parse file type token', function() {
        const input = 'file://my_file';
        const expected: Token = { file: 'my_file' };

        const result = parseToken(input);

        expect(result).to.deep.equal(expected);
    });

    it('Parse env type token', function() {
        const input = 'env:my_env';
        const expected: Token = { env: 'my_env' };

        const result = parseToken(input);

        expect(result).to.deep.equal(expected);
    });


    it('Parse string type token', function() {
        const input = 'my_string';
        const expected: Token = { string: 'my_string' };

        const result = parseToken(input);

        expect(result).to.deep.equal(expected);
    });

    it('Load file type token', async function() {
        const input: Token = parseToken('file://my_file')
        const expected = fileJwtToken;

        const result = loadToken(input, (error: string) => {
            expect.fail('Error loading token: ' + error);
        });

        expect(result).to.equal(expected);
    });

    it('Load env type token', async function() {
        const input: Token = parseToken('env:my_env')
        const expected = envJwtToken;

        const result = loadToken(input, (error: string) => {
            expect.fail('Error loading token: ' + error);
        });

        expect(result).to.equal(expected);
    });


    it('Load string type token', async function() {
        const input: Token = parseToken('my_string')
        const expected = 'my_string';

        const result = loadToken(input, (error: string) => {
            expect.fail('Error loading token: ' + error);
        });

        expect(result).to.equal(expected);
    });
});

