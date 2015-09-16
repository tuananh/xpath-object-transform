'use strict'

let transform = require('../lib/xpath-object-transform'),
    fs = require('fs'),
    libxmljs = require('libxmljs')

let template = {
    lang: '/HotelValuedAvailRS/AuditData/ProcessTime'
}

let xml = fs.readFileSync('./hotelbed.xml', 'utf8')

// var result = transform(xml, template);

var xmlDoc = libxmljs.parseXml(xml)
var gchild = xmlDoc.get('/HotelValuedAvailRS/AuditData/ProcessTime')

console.log(gchild.text())

// console.log(JSON.stringify(result, null, 2));
