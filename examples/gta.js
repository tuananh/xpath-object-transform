'use strict'

let transform = require('../lib/xpath-object-transform'),
    fs = require('fs')

let template = {
    lang: '/Response/ResponseDetails/@Language',
    rooms: [
        '/Response/ResponseDetails/SearchHotelPricePaxResponse/HotelDetails/Hotel/PaxRoomSearchResults/PaxRoom/RoomCategories/RoomCategory',
        {
            desc: 'Description',
            id: './@Id',
            price: 'ItemPrice',
            priceGross: 'HotelRoomPrices/HotelRoom/PriceRanges/PriceRange/Price/@Gross',
            currencyCode: 'ItemPrice/@Currency',
            nightsCount: 'HotelRoomPrices/HotelRoom/PriceRanges/PriceRange/Price/@Nights',
            meals: 'Meals/Basis',
            fromDate: 'HotelRoomPrices/HotelRoom/PriceRanges/PriceRange/DateRange/FromDate',
            toDate: 'HotelRoomPrices/HotelRoom/PriceRanges/PriceRange/DateRange/ToDate'
            // ,up: '../../@RoomIndex'
        }
    ]
    ,goingUp: '/Response/ResponseDetails/SearchHotelPricePaxResponse/HotelDetails/Hotel/PaxRoomSearchResults/PaxRoom/RoomCategories/RoomCategory/../../@RoomIndex'
    // ,test2: '/Response/ResponseDetails/../@ResponseReference'
}

let xml = fs.readFileSync('./gta.xml', 'utf8')

console.time('transform')
var result = transform(xml, template);
console.timeEnd('transform')
// console.log(JSON.stringify(result, null, 2));
