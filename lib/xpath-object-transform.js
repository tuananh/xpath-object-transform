(function(root, factory) {
    'use strict'

    // AMD
    if (typeof define === 'function' && define.amd) {
        define('xpathObjectTransform', ['libxmljs'], function(libxmljs) {
            return (root.xpathObjectTransform = factory(libxmljs))
        })
    }

    // Node
    else if (typeof exports === 'object') {
        module.exports = factory(require('libxmljs'))
    }

    // Browser global
    else {
        root.xpathObjectTransform = factory(root.libxmljs)
    }
}(this, function(libxmljs) {
    'use strict'

    let extend = require('util')._extend

    /**
     * Step through data object and apply path transforms.
     *
     * @param {object} data
     * @param {object} path
     * @param {object} result
     * @param {string} key
     */
    function walk(data, path, result, key, parentpath, parentObj) {
        let doc = libxmljs.parseXml(data),
            fn
        if (path.toString().startsWith('^')) {
            // console.log('path', path);
            // console.log('parentpath', path, 'parentObj', parentObj.toString());
            let paths = parentpath.split('/'),
                pathStr = path.toString()

            while (pathStr.startsWith('^')) {
                pathStr = pathStr.substring(1)
                paths.pop()
            }

            let goUpPath = paths.join('/') + pathStr,
                seek = parentObj.get(goUpPath),
                resultGoUP = seek ? display(seek) + ' [' + goUpPath + ']' : 'seekSingle @@@ [' + goUpPath + ']'

            fn = seekSingle
            fn(parentObj, goUpPath, result, key)
        } else {
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
                fn(doc, path, result, key, parentpath, parentObj)
            }
        }
    }

    /**
     * type - Determine type of object.
     *
     * @param {object} obj
     * @returns {string}
     */
    function type(obj) {
        return Array.isArray(obj) ? 'array' : typeof obj
    }

    function display(seek) {
        if (!seek || !seek.type) return 'display @@@ '

        switch (seek.type()) {
            case 'comment':
            case 'text':
            case 'element':
                return seek.text()
                break
            case 'attribute':
                return seek.value()
                break
            default:
                return seek.toString()
                break
        }
    }

    /**
     * seekSingle - Get single property from data object.
     *
     * @param {object} data
     * @param {string} pathStr
     * @param {object} result
     * @param {string} key
     */
    function seekSingle(doc, pathStr, result, key, parentpath, parentObj) {
        // console.log('doc', doc.toString());
        // console.log('pathStr', pathStr);
        // NOTE: if empty -> return empty;
        // if start with '#', remove '#' and do not process
        if (pathStr.trim() === '') {
            result[key] = ''
        } else if (pathStr.startsWith('#')) {
            result[key] = pathStr.replace('#', '')
        } else {
            let seek = doc.get(pathStr)
            result[key] = seek ? display(seek) + ' [' + pathStr + ']' : 'seekSingle @@@ [' + pathStr + ']'
        }
    }

    /**
     * seekArray - Get array of properties from data object.
     *
     * @param {object} data
     * @param {array} pathArr
     * @param {object} result
     * @param {string} key
     */
    function seekArray(doc, pathArr, result, key, parentpath, parentObj) {
        let path = pathArr[0],
            subpath = pathArr[1],
            seek = doc.find(path)

        if (seek.length) {
            result = result[key] = []

            seek.forEach(function(item, idx) {
                walk(item, subpath, result, idx, path, doc)
            })

        } else {
            result[key] = seek ? display(seek) : 'seekArray @@@ ' + JSON.stringify(pathArr)
        }
    }

    /**
     * seekObject - Get object property from data object.
     *
     * @param {object} data
     * @param {object} pathObj
     * @param {object} result
     * @param {string} key
     */
    function seekObject(doc, pathObj, result, key, parentpath, parentObj) {
        if (typeof key !== 'undefined') {
            result = result[key] = {}
        }

        Object.keys(pathObj).forEach(function(name) {
            walk(doc, pathObj[name], result, name, parentpath, parentObj)
        })
    }

    /**
     * @module xpath-object-transform
     * @param {object} data
     * @param {object} path
     * @returns {object}
     */
    return function(data, path) {
        let result = {}
        walk(data, path, result)

        return result
    }
}))
