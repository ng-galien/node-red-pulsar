function isObject(obj) {
  return obj === Object(obj);
}

function isFunction(obj) {
  return typeof obj === 'function';
}

function isString(obj) {
    return typeof obj === 'string';
}

function isNumber(obj) {
    return typeof obj === 'number';
}

function isBoolean(obj) {
    return typeof obj === 'boolean';
}

function isArray(obj) {
    return Array.isArray(obj);
}

function isUndefined(obj) {
    return obj === void 0;
}

function isNull(obj) {
    return obj === null;
}

function isPositiveNumber(obj) {
    return isNumber(obj) && obj > 0;
}

function isNonEmptyString(obj) {
    return isString(obj) && obj.length > 0;
}

function isNonEmptyArray(obj) {
    return isArray(obj) && obj.length > 0;
}

module.exports = {
    isObject: isObject,
    isFunction: isFunction,
    isString: isString,
    isNumber: isNumber,
    isBoolean: isBoolean,
    isArray: isArray,
    isUndefined: isUndefined,
    isNull: isNull,
    isPositiveNumber: isPositiveNumber,
    isNonEmptyString: isNonEmptyString,
    isNonEmptyArray: isNonEmptyArray
}