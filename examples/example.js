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
            attr: '@attr',
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
    ,goUp: '/root/child/grandchild/..'
    ,sibling: '/root/child/@foo'
}

var xml = require('fs').readFileSync('./example.xml', 'utf8')

var result = transform(xml, template);

console.log(JSON.stringify(result, null, 2));
