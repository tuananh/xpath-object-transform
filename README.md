xpath-object-transform
======

A npm module to convert xml document to json based on a JSON template.

Project in flux, not stable. Nothing is guaranteed.

I wrote this for a project at work and I had to customize `xpath` syntax a bit to suit with my need. Will eventually update README at some point.

Any problem, suggestion, you can hit me at me@tuananh.org or open an issue on GitLab.

Installation
-----

```js
npm install xpath-object-transform --save
```

Usage
-----

```js
var transform = require('xpath-object-transform')

var result = transform(xml, template)
```

TODO
-----

* Update documentation
* Add test unit
* Add more examples
