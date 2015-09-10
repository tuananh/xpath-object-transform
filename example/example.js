/*jshint laxbreak:true*/
/*global window, require, console*/

var transform = (typeof exports === 'object') ? require('../lib/xpath-object-transform') : window.jsonpathObjectTransform;

var template = {
    grandchild : [
        '/root/child/grandchild',
        {
            baz: '@baz',
            buz: '@buz',
            obj: {
                a: '../abc/@baz'
            }
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
    '<grandchild baz="baz1" buz="buz1">grandchild content 1</grandchild>' +
    '<grandchild baz="baz2" buz="buz2">grandchild content 2</grandchild>' +
    '<abc baz="fizbuzzab">abc</abc>' +
    '<grandchild baz="baz3" buz="buz3">grandchild content 3</grandchild>' +
    '<grandchild baz="baz4" buz="buz4">grandchild content 4</grandchild>' +
    '</child>' +
    '<sibling baz="buzzz">im sibling</sibling>' +
    '</root>';

var result = transform(xml, template);

console.log(JSON.stringify(result, null, 2));
