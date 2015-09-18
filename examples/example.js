/*jshint laxbreak:true*/
/*global window, require, console*/

var transform = (typeof exports === 'object') ? require('../lib/xpath-object-transform') : window.jsonpathObjectTransform;

var template = {
    seekObject: {
        seekSingle: 'object/single',
        seekArray: [
            'object/array/item', {
                key: 'item/key',
                seekGoingUp: '^^/goingUp/@attr',
                seekGoingUpArray: ['^^/goingUp/age', {
                    age: '.'
                }]
            }
        ]
    }
    ,sum: 'sum(/root/object/goingUp/age)'
}

var xml = require('fs').readFileSync('./example.xml', 'utf8')

var result = transform(xml, template);

console.log(JSON.stringify(result, null, 2));
