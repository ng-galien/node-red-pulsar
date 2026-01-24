import { expect } from 'chai';
import {
  createTokenSupplier,
  loadToken,
  parseToken,
  Token,
  TokenSupplier,
} from '../../src/Token';
import * as fs from 'node:fs';
import sinon from 'sinon';
import axios from 'axios';

describe('Token functions', function () {
  const envJwtToken = 'TestEnvValue';
  const fileJwtToken = 'TestFileContent';
  const httpJwtToken = 'TestUrlContent';

  before(function () {
    // setup environment variable for test
    process.env['my_env'] = envJwtToken;
    // setup file for test
    fs.writeFileSync('my_file', fileJwtToken, 'utf8');
    // setup http mock for test
    sinon.mock(axios).expects('get').twice().resolves({ data: httpJwtToken });
  });

  after(function () {
    delete process.env['my_env'];
    fs.unlinkSync('my_file');
    sinon.restore();
  });

  it('Parse file type token', function () {
    const input = 'file://my_file';
    const expected: Token = { file: 'my_file' };

    const result = parseToken(input);

    expect(result).to.deep.equal(expected);
  });

  it('Parse env type token', function () {
    const input = 'env:my_env';
    const expected: Token = { env: 'my_env' };

    const result = parseToken(input);

    expect(result).to.deep.equal(expected);
  });

  it('Parse string type token', function () {
    const input = 'my_string';
    const expected: Token = { string: 'my_string' };

    const result = parseToken(input);

    expect(result).to.deep.equal(expected);
  });

  it('Load file type token', async function () {
    const input: Token = parseToken('file://my_file');
    const expected = fileJwtToken;

    const result = loadToken(input, (error: string) => {
      expect.fail('Error loading token: ' + error);
    });

    expect(result).to.equal(expected);
  });

  it('Load env type token', async function () {
    const input: Token = parseToken('env:my_env');
    const expected = envJwtToken;

    const result = loadToken(input, (error: string) => {
      expect.fail('Error loading token: ' + error);
    });

    expect(result).to.equal(expected);
  });

  it('Load string type token', async function () {
    const input: Token = parseToken('my_string');
    const expected = 'my_string';

    const result = loadToken(input, (error: string) => {
      expect.fail('Error loading token: ' + error);
    });

    expect(result).to.equal(expected);
  });

  it('Create token supplier from file', function () {
    const input: Token = parseToken('file://my_file');

    const supplier = createTokenSupplier(input, (error: string) => {
      expect.fail('Error creating supplier: ' + error);
    });

    expect(supplier).to.be.a('function');
    const result = (supplier as () => string)();
    expect(result).to.equal(fileJwtToken);
  });

  it('Create token supplier from env', function () {
    const input: Token = parseToken('env:my_env');

    const supplier = createTokenSupplier(input, (error: string) => {
      expect.fail('Error creating supplier: ' + error);
    });

    expect(supplier).to.be.a('function');
    const result = (supplier as () => string)();
    expect(result).to.equal(envJwtToken);
  });

  it('Create token supplier from string returns string directly', function () {
    const input: Token = parseToken('my_string');

    const supplier = createTokenSupplier(input, (error: string) => {
      expect.fail('Error creating supplier: ' + error);
    });

    expect(supplier).to.equal('my_string');
  });

  it('Token supplier re-reads file on each call', function () {
    const testFile = 'test_dynamic_file';
    fs.writeFileSync(testFile, 'initial_value', 'utf8');

    const input: Token = parseToken(`file://${testFile}`);
    const supplier = createTokenSupplier(input, (error: string) => {
      expect.fail('Error creating supplier: ' + error);
    }) as () => string;

    expect(supplier()).to.equal('initial_value');

    // Update file content
    fs.writeFileSync(testFile, 'updated_value', 'utf8');

    // Supplier should return new value
    expect(supplier()).to.equal('updated_value');

    fs.unlinkSync(testFile);
  });

  it('Token supplier re-reads env on each call', function () {
    process.env['dynamic_env'] = 'initial_env_value';

    const input: Token = parseToken('env:dynamic_env');
    const supplier = createTokenSupplier(input, (error: string) => {
      expect.fail('Error creating supplier: ' + error);
    }) as () => string;

    expect(supplier()).to.equal('initial_env_value');

    // Update env variable
    process.env['dynamic_env'] = 'updated_env_value';

    // Supplier should return new value
    expect(supplier()).to.equal('updated_env_value');

    delete process.env['dynamic_env'];
  });

  it('Token supplier returns undefined for non-existent file', function () {
    const input: Token = parseToken('file://non_existent_file');
    let errorCalled = false;

    const supplier = createTokenSupplier(input, () => {
      errorCalled = true;
    });

    expect(supplier).to.be.undefined;
    expect(errorCalled).to.be.true;
  });

  it('Token supplier returns undefined for non-existent env', function () {
    const input: Token = parseToken('env:non_existent_env');
    let errorCalled = false;

    const supplier = createTokenSupplier(input, () => {
      errorCalled = true;
    });

    expect(supplier).to.be.undefined;
    expect(errorCalled).to.be.true;
  });
});
