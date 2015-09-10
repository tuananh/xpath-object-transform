/*jshint laxbreak:true*/
/*global window, require, console*/

var transform = (typeof exports === 'object') ? require('../lib/xpath-object-transform') : window.jsonpathObjectTransform;

var template = {
    grandchild : [
        '/root/child/grandchild',
        {
            data: '@baz',
            sibling: '@buz'
        }
    ],
    anObj: {
        node: '/root/sibling',
        abc: '/root/child/abc',
        def : {
            ghi: '/root/sibling/@baz'
        }
    },
    goUp: '/root/child/grandchild/..',
    sibling: '/root/sibling'
}

var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<root>' +
    '<child foo="bar">' +
    '<grandchild baz="fizbuzz1" buz="xxx1">grandchild content 1</grandchild>' +
    '<grandchild baz="fizbuzz2" buz="xxx2">grandchild content 2</grandchild>' +
    '<abc baz="fizbuzzab">abc</abc>' +
    '<grandchild baz="fizbuzz3" buz="xxx3">grandchild content 3</grandchild>' +
    '<grandchild baz="fizbuzz4" buz="xxx4">grandchild content 4</grandchild>' +
    '</child>' +
    '<sibling baz="buzzz">im sibling</sibling>' +
    '</root>';

var result = transform(xml, template);

console.log(JSON.stringify(result, null, 2));
