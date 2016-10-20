var template = {
    hotelSummary: ['/result/hotels/hotel', {
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

module.exports = template
