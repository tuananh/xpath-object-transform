# xpath-object-transform

📌 DEPRECATED: Please use [camaro](https://github.com/tuananh/camaro) instead.

> A npm module to convert xml document to json based on a JSON template.

XML is noisy and a pain to deal with. I just want to work with JSON.

## Motivation

Most of the xml to JSON libraries will convert the complete xml document to a complete JSON object but in my use cases, I don't really want that. I just want certain attributes.

Ideally, I just want to write a template specifies how to transform it and get the result. Hence this package.

## Installation

```js
npm install xpath-object-transform --save
```

## Usage

```js
var transform = require('xpath-object-transform')

var result = transform(xml, template)
```

## TODO

* Update documentation
* Add test unit
* Add more examples
* Add benchmarks
