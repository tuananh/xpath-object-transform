/*jshint evil:true*/
/*global module, require, define*/

(function(root, factory) {
    'use strict';

    // AMD
    if (typeof define === 'function' && define.amd) {
        define('xpathObjectTransform', ['libxmljs'], function(libxmljs) {
            return (root.xpathObjectTransform = factory(libxmljs));
        });
    }

    // Node
    else if (typeof exports === 'object') {
        module.exports = factory(require('libxmljs'));
    }

    // Browser global
    else {
        root.xpathObjectTransform = factory(root.libxmljs);
    }
}(this, function(libxmljs) {
    'use strict';

    var extend = require('util')._extend

    /**
     * Step through data object and apply path transforms.
     *
     * @param {object} data
     * @param {object} path
     * @param {object} result
     * @param {string} key
     */
    function walk(data, path, result, key) {
        // console.log('@@@WALKKKK path: %s , result: %s, key: %s', JSON.stringify(path), JSON.stringify(result), JSON.stringify(key))
        var fn;

        switch (type(path)) {
            case 'string':
                fn = seekSingle;
                break;

            case 'array':
                fn = seekArray;
                break;

            case 'object':
                fn = seekObject;
                break;
        }

        if (fn) {
            fn(data, path, result, key);
        }
    }

    /**
     * Determine type of object.
     *
     * @param {object} obj
     * @returns {string}
     */
    function type(obj) {
        return Array.isArray(obj) ? 'array' : typeof obj;
    }

    /**
     * seekSingle - Get single property from data object.
     *
     * @param {object} data
     * @param {string} pathStr
     * @param {object} result
     * @param {string} key
     */
    function seekSingle(data, pathStr, result, key) {
        // var seek = jsonPath.eval(data, pathStr) || [];
        var seek = libxmljs.parseXml(data).get(pathStr)
        if (!seek) throw new Error('PATH_NOT_FOUND ' + pathStr)

        seek.display = function () {
            if (seek.text) return seek.text()
            if (seek.value) return seek.value()
            if (seek.toString) return seek.toString()
        }

        result[key] = seek ? seek.display() + ' [' + pathStr + ']' : 'seekSingle failed...[' + pathStr + ']'
        // result[key] = seek.length ? seek[0] : undefined;

        // console.log('seekSingle--------')
        // console.log('data: %s, pathStr: %s , result: %s, key: %s', JSON.stringify(data), JSON.stringify(pathStr), JSON.stringify(result), JSON.stringify(key))
        // console.log('seek Single', seek)
        // console.log('seekSingle---END-----\r\n\r\n')
    }

    /**
     * seekArray - Get array of properties from data object.
     *
     * @param {object} data
     * @param {array} pathArr
     * @param {object} result
     * @param {string} key
     */
    function seekArray(data, pathArr, result, key) {
        var subpath = pathArr[1];
        var path = pathArr[0];
        var seek = libxmljs.parseXml(data).get(path)

        let idx = 0

        var sibling = seek.nextSibling()
        if (sibling) {
            result = result[key] = []

            // console.log('@@@@@@@I GOT SIBLING ┬──┬ ノ( ゜-゜ノ)')
            while (sibling) {

                var tmpTemplate = extend({}, subpath)
                for (let p in subpath) {
                    let tmpPath = path + '[' + (idx+1) + ']' + '/' + subpath[p]
                    tmpTemplate[p] = tmpPath
                    // console.log('######tmpPath: %s , idx: %s', JSON.stringify(tmpPath), JSON.stringify(idx))
                }

                console.log('tmpTemplate', tmpTemplate)

                walk(data, tmpTemplate, result, idx)

                ++idx
                sibling = sibling.nextSibling()
                // console.log('@@@@@@@I GOT SIBLING ┬──┬ ノ( ゜-゜ノ)')
            }


        } else {
            // console.log('I HAVE NO SIBLING (┛◉Д◉)┛彡┻━┻')
            result[key] = seek ? seek.text() : 'seekArray failed..' + JSON.stringify(pathArr)
        }


        // if (seek.length && subpath) {
        //     result = result[key] = [];
        //
        //     seek[0].forEach(function(item, index) {
        //         walk(item, subpath, result, index);
        //     });
        // } else {
        //     result[key] = seek;
        // }

        // console.log('SEEKARRAY------------')
        // console.log('data: %s, pathArr: %s , result: %s, key: %s', JSON.stringify(data), JSON.stringify(pathArr), JSON.stringify(result), JSON.stringify(key))
        // console.log('seek Array', seek)
        // console.log('SEEKARRAY--END----------\r\n\r\n')
    }

    /**
     * seekObject - Get object property from data object.
     *
     * @param {object} data
     * @param {object} pathObj
     * @param {object} result
     * @param {string} key
     */
    function seekObject(data, pathObj, result, key) {
        if (typeof key !== 'undefined') {
            result = result[key] = {};
        }

        // console.log('seekObject------------')
        // console.log('data: %s, pathObj: %s , result: %s, key: %s', JSON.stringify(data), JSON.stringify(pathObj), JSON.stringify(result), JSON.stringify(key))
        // console.log('seekObject-----END-------\r\n\r\n')

        Object.keys(pathObj).forEach(function(name) {
            walk(data, pathObj[name], result, name);
        });
    }

    /**
     * @module jsonpath-object-transform
     * @param {object} data
     * @param {object} path
     * @returns {object}
     */
    return function(data, path) {
        var result = {};

        walk(data, path, result);

        return result;
    };

}));
