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
     * @param {string} parentpath
     * @param {object} parentObj
     */
    function walk(data, path, result, key, parentpath, parentObj) {
        let doc = libxmljs.parseXml(data),
            isGoingUp = path.toString().startsWith('^'),
            fn

        switch (type(path)) {
            case 'string':
                fn = isGoingUp ? handleGoingUp : seekSingle
                break

            case 'array':
                fn = isGoingUp ? handleGoingUp : seekArray
                break

            case 'object':
                fn = seekObject
                break
        }
        if (fn) {
            fn(doc, path, result, key, parentpath, parentObj)
        }
    }

    /**
     * handleGoingUp - Handling special case when going up to parent node.
     *
     * @param {object} data
     * @param {object} path
     * @param {object} result
     * @param {string} key
     * @param {string} parentpath
     * @param {object} parentObj
     */

    function handleGoingUp(data, path, result, key, parentpath, parentObj) {
        let paths = parentpath.split('/'),
            pathType = type(path),
            pathStr,
            goingUpPath

        switch (pathType) {
            case 'string':
                pathStr = path.toString()
                break
            case 'array':
                pathStr = path[0]
                break
        }

        while (pathStr.startsWith('^')) {
            pathStr = pathStr.substring(1)
            paths.pop()
        }

        switch (pathType) {
            case 'string':
                goingUpPath = paths.join('/') + pathStr
                seekSingle(parentObj, goingUpPath, result, key)
                break
            case 'array':
                goingUpPath = [paths.join('/') + pathStr, path[1]]
                seekArray(parentObj, goingUpPath, result, key)
                break
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

        if (!seek) return 'display @@@ '
        if (!seek.type) return seek.toString()

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
     * @param {string} parentpath
     * @param {object} parentObj
     */
    function seekSingle(doc, pathStr, result, key, parentpath, parentObj) {
        // NOTE: if empty -> return empty;
        // if start with '#', remove '#' and do not process
        if (pathStr.trim() === '') {
            result[key] = ''
        } else if (pathStr.startsWith('#')) {
            result[key] = pathStr.replace('#', '')
        } else {
            let seek = doc.get(pathStr)
            // if (!seek) console.log('seekSingle @@@ [' + pathStr + ']')
            result[key] = seek ? display(seek) : ''
        }
    }

    /**
     * seekArray - Get array of properties from data object.
     *
     * @param {object} data
     * @param {array} pathArr
     * @param {object} result
     * @param {string} key
     * @param {string} parentpath
     * @param {object} parentObj
     */
    function seekArray(doc, pathArr, result, key, parentpath, parentObj) {
        let path = pathArr[0],
            subpath = pathArr[1],
            seek = doc.find(path)

        // NOTE: when array loop with current node, set path to parentpath; doc to parentObj
        if (path === '.') {
            path = parentpath
            seek = parentObj.find(path)
            doc = parentObj
        }

        if (seek.length) {
            result = result[key] = []

            seek.forEach(function(item, idx) {
                walk(item, subpath, result, idx, path, doc)
            })

        } else {
            // if (!seek) console.log('seekArray @@@ ' + JSON.stringify(pathArr))
            result[key] = []
        }
    }

    /**
     * seekObject - Get object property from data object.
     *
     * @param {object} data
     * @param {object} pathObj
     * @param {object} result
     * @param {string} key
     * @param {string} parentpath
     * @param {object} parentObj
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
