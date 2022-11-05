/**
 * @function
 *
 * @param {*} value The object.
 * @returns {Boolean} Returns true if the object is defined, returns false otherwise.
 *
 * @example
 * if (defined(positions)) {
 *      doSomething();
 * } else {
 *      doSomethingElse();
 * }
 */
export const defined = (value: {}) => {
    return value !== undefined && value !== null;
}

/**
 * Returns the first parameter if not undefined, otherwise the second parameter.
 * Useful for setting a default value for a parameter.
 *
 * @function
 *
 * @param {*} a
 * @param {*} b
 * @returns {*} Returns the first parameter if not undefined, otherwise the second parameter.
 *
 * @example
 * param = defaultValue(param, 'default');
 */
export const defaultValue = (a: {}, b: {}) => {
    if (a !== undefined && a !== null) {
        return a;
    }
    return b;
}

/**
 * A frozen empty object that can be used as the default value for options passed as
 * an object literal.
 * @type {Object}
 * @memberof defaultValue
 */
defaultValue.EMPTY_OBJECT = Object.freeze({});


