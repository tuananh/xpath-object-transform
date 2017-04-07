'use strict'

let libxmljs = require('libxmljs-mt')
// let libxmljs = require('libxmljs')

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
    let doc = data,
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

    if (!seek) return 'display @@@'
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
 * @param {string} data
 * @param {object} path
 * @returns {object}
 */
function transform(data, path) {
    if (typeof data !== 'string') {
        throw new TypeError(`expecting data to be string, got ${typeof data}`)
    }
    
    let result = {}

    try {
        data = libxmljs.parseXml(data, { noblanks: true, compact: true })    
    } catch (err) {
        throw new Error('malformed xml')
    }
    
    walk(data, path, result)
    return result
}

module.exports = transform