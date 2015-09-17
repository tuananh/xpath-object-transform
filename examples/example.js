/*jshint laxbreak:true*/
/*global window, require, console*/

var transform = (typeof exports === 'object') ? require('../lib/xpath-object-transform') : window.jsonpathObjectTransform;

var template = {
    anObj: {
        room: [
            '/root/hotel/rooms/room',
            {
                attribute: '^^/info/@attr',
                info:['.',{
                    text: 'rateKey',
                    adult: '^^/info/@attr'
                }]
            }
        ]
    }
}

var xml = require('fs').readFileSync('./example.xml', 'utf8')

var result = transform(xml, template);

console.log(JSON.stringify(result, null, 2));
