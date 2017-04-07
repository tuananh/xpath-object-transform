var transform = require('../index')
var fs        = require('fs')
var chai      = require('chai')
var should    = chai.should()

describe('transform-test', () => {

    it('should transform', () => {
        var xml = fs.readFileSync(__dirname + '/dotw.xml', 'utf-8')
        var template = require(__dirname + '/dotw-template.js')

        console.time('transform')
        var result = transform(xml, template)
        console.timeEnd('transform')
        result.should.have.property('hotelSummary').with.length(100)
        result.hotelSummary[0].should.have.property('roomList')
        result.hotelSummary[0].roomList[0].should.have.property('numberOfAdults')

    })
})
