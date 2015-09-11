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
        }
    ]
}

let xml = fs.readFileSync('./gta.xml', 'utf8')

var result = transform(xml, template);

console.log(JSON.stringify(result, null, 2));
