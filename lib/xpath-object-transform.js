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
        let doc = libxmljs.parseXml(data),
            fn

        switch (type(path)) {
            case 'string':
                fn = seekSingle
                break

            case 'array':
                fn = seekArray
                break

            case 'object':
                fn = seekObject
                break
        }

        if (fn) {
            fn(doc, path, result, key)
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

    function getType(seek) {
        return seek.type()
    }

    /**
     * seekSingle - Get single property from data object.
     *
     * @param {object} data
     * @param {string} pathStr
     * @param {object} result
     * @param {string} key
     */
    function seekSingle(doc, pathStr, result, key) {
        // var seek = jsonPath.eval(data, pathStr) || [];
        var seek = doc.get(pathStr)
        if (!seek) throw new Error('PATH_NOT_FOUND ' + pathStr)

        // FIXME: refactor this, check node type and use appropriate function
        seek.display = function () {
            if (seek.text) return seek.text()
            if (seek.value) return seek.value()
            if (seek.toString) return seek.toString()
        }

        result[key] = seek ? seek.display() + ' [' + pathStr + ']' : 'seekSingle failed...[' + pathStr + ']'
        // result[key] = seek.length ? seek[0] : undefined;

    }

    /**
     * seekArray - Get array of properties from data object.
     *
     * @param {object} data
     * @param {array} pathArr
     * @param {object} result
     * @param {string} key
     */
    function seekArray(doc, pathArr, result, key) {
        var subpath = pathArr[1];
        var path = pathArr[0];
        var seek = doc.find(path)

        seek.display = function () {
            if (seek.text) return seek.text()
            if (seek.value) return seek.value()
            if (seek.toString) return seek.toString()
        }

        if (seek && seek.length) {
            // console.log('found ', seek.length)
            result = result[key] = []

            seek.forEach(function (item, idx) {
                console.log('seek.forEach', item.text())
                walk(item, subpath, result, idx)
            })

        } else {
            console.log('I HAVE NO SIBLING (┛◉Д◉)┛彡┻━┻')
            result[key] = seek ? seek.display() : 'seekArray failed..' + JSON.stringify(pathArr)
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

    }

    /**
     * seekObject - Get object property from data object.
     *
     * @param {object} data
     * @param {object} pathObj
     * @param {object} result
     * @param {string} key
     */
    function seekObject(doc, pathObj, result, key) {
        if (typeof key !== 'undefined') {
            result = result[key] = {};
        }

        Object.keys(pathObj).forEach(function(name) {
            walk(doc, pathObj[name], result, name);
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
