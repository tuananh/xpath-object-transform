'use strict'

let transform = require('../lib/xpath-object-transform'),
    fs = require('fs')

let template = {
    requestId: '#',
    currencyCode: '#USD',
    hotelSummary: ['/result/hotels/hotel', {
        provider: '#DOTW',
        hotelId: '@hotelid',
        expediaId: '#',
        hotelInfo: {
            name: '#',
            address: '#',
            city: '#',
            postalCode: '#',
            countryCode: '#',
            hotelRating: '#',
            latitude: '#',
            longitude: '#',
            shortDescription: '#',
            remark: '#',
            childPolicy: {},
            images: {
                thumb: '',
                hotelImages: []
            },
            amenities: []
        },
        roomList: ['rooms/room', {
            numberOfAdults: './@adults',
            numberOfChildren: './@children',
            roomNo: '#',
            rooms: ['roomType', {
                roomTypeCode: './@roomtypecode',
                roomName: 'name',
                roomAmenities: ['roomAmenities/amenity', {
                    name: '.',
                    code: '@id'
                }],
                benefits: [],
                images: [],
                rateList: ['rateBases/rateBasis', {
                    rateCode: 'concat(@id,"-",@runno)',
                    name: './@description',
                    price: 'sum(dates/date/price/text())',
                    cancellationPolicies: ['cancellationRules/rule', {
                        from: 'fromDate',
                        to: 'toDate',
                        amount: 'cancelCharge/text()'
                    }]
                }]
            }]
        }]
    }]
}

let xml = fs.readFileSync('./dotw.xml', 'utf8')

console.time('transform')
var result = transform(xml, template)
console.timeEnd('transform')
// console.log(JSON.stringify(result, null, 2))