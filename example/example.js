/*jshint laxbreak:true*/
/*global window, require, console*/

var transform = (typeof exports === 'object') ? require('../lib/xpath-object-transform') : window.jsonpathObjectTransform;

var template = {
    grandchild : [
        '/root/child/grandchild',
        {
            baz: '@baz',
            buz: '@buz'
        }
    ],
    arrInsideArr : [
        '/root/arr1/arr2',
        {
            // attr: '@attr',
            arr: [
                'item',
                {
                    value: '.'
                }
            ]
        }
    ],
    anObj: {
        node: '/root/sibling',
        abc: '/root/child/abc',
        def : {
            ghi: '/root/sibling/@baz'
        },
        arr: [
            '/root/arr1/arr2/item',
            {
                a: '.'
            }
        ]
    }
    // ,arr1: [
    //     '/root/arr1/arr2',
    //     {
    //         x: '.'
    //     }
    // ]
    // test: '/root/arr1/arr2/item/.'
    // goUp: '/root/child/grandchild/..',
    // sibling: '/root/sibling'
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
    '<arr1>' +
    '<arr2 attr="attr 1"><item>item1</item><item>item2</item></arr2>' +
    '<arr2 attr="attr 2"><item>item3</item><item>item4</item></arr2>' +
    '</arr1>' +
    '<sibling baz="buzzz">im sibling</sibling>' +
    '</root>';

var result = transform(xml, template);

console.log(JSON.stringify(result, null, 2));
