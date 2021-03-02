/**
 *
 * @description Clone a plain javascript object, using recursive deep copy.
 *
 * Features:
 * - handles nested objects
 * - handles circular references
 *
 * Supported types:
 * - primitive (null, string, number, boolean)
 * - Date
 * - Array
 * - Object (including Function)
 *
 * @param obj Object to clone
 *
 * @return clone of obj
 *
 * @throws Error if obj type is unsupported
 *
 */
const deepCopyObj = function(obj) {
    // Map of all visited objects
    let originMap = new Map();
    // Map of all cloned objects
    let cloneMap = new Map();
    // name of the UID property
    let uidProp = '__DEEP_COPY_UID__';
    // Value to increment to generate UID.
    // UID purpose is to mark visited objects with, to handle circular references
    let id = 1;

    // function to perform recursive deep copy
    let copy = (obj) => {
        // if obj is a primitive value, return it as is
        if (typeof obj === "undefined"
            || obj === null
            || typeof obj === "string"
            || typeof obj === "number"
            || typeof obj === "boolean") {
            return obj;
        }
        // if obj is a Date, set the same date as original object and return it
        if (obj instanceof Date) {
            let res = new Date();
            res.setTime(obj.getTime());
            return res;
        }
        // if obj is an Array, return a deep copy of its items
        if (obj instanceof Array) {
            let res = [];
            obj.forEach(item => {
                res.push(copy(item));
            });
            return res;
        }
        // if obj is an Object :
        // - if obj has already been cloned, return a reference to the clone
        // - else, return a deep copy of its items
        if (obj instanceof Object) {
            if (obj[uidProp]) {
                return cloneMap.get(obj[uidProp]);
            }
            let uid = id++;
            let res = {};

            if (obj instanceof Function) {
                res = function () {
                    return obj.apply(this, arguments);
                };
            }
            cloneMap.set(uid, res);

            obj[uidProp] = uid;
            originMap.set(uid, obj);

            Object.keys(obj).forEach(key => {
                if (key !== uidProp && obj.hasOwnProperty(key)) {
                    res[key] = copy(obj[key]);
                }
            });
            return res;
        }
        // if obj type is unsupported, throw an Error
        let errorMessage = "Unable to copy object, unsupported type";
        this._app.$log.warn(errorMessage, obj);
        throw new Error(errorMessage);
    };
    // start deep copy
    let res = copy(obj);

    // clean UID prop on each visited object
    originMap.forEach(item => {
        delete item[uidProp];
    });

    // return a clone of the original object
    return res;
}

export default deepCopyObj;