
//- Tất cả các keys biến global được lưu ở đây
//- Kiểm tra trước khi add keys để tránh trùng lặp

const keyFlight = {
   dataSearchFrom: 'dataSearchFrom',
   dataSearchTo: 'dataSearchTo',
   requestFilterFlight: 'requestFilterFlight'
}

export const nGlobalKeys = {
   lang: 'lang',
   currency: 'VND',
   listCountries: 'listCountries',
   listCountriescode: 'listCountriescode',
   listCity: 'listCity',
   dataHotelSearch: 'dataHotelSearch',
   hotelCode: 'hotelCode',
   listHotelAvail: 'listHotelAvail',
   YourInformation: 'YourInformation',
   HotelInformation: 'HotelInformation',
   PriceInformation: 'PriceInformation',
   IdOrder: 'IdOrder',
   dataPayment: 'dataPayment',
   PeopleData: 'PeopleData',
   pointEarn: 'pointEarn',
   BankTransfer: 'BankTransfer',
   timeGetExpiredPayment: 'timeGetExpiredPayment',
   arrCurrencies: 'arrCurrencies',
   checkExpiredPayment: 'checkExpiredPayment',
   ipv4Address: 'ipv4Address',
   BellingCode: 'BellingCode',
   //tour
   dataSearchTour: 'dataSearchTour',
   //filter
   idDestinationZone: 'idDestinationZone',
   idDestinationZone1: 'idDestinationZone1',
   arrRoomOffer: 'arrRoomOffer',
   arrRoomOffer1: 'arrRoomOffer1',
   arrRoomHave: 'arrRoomHave',
   arrRoomHave1: 'arrRoomHave1',
   arrIdCheckFacility: 'arrIdCheckFacility',
   arrIdCheckFacility1: 'arrIdCheckFacility1',
   dataStringOffer: 'dataStringOffer',
   listStringDestinationZone: 'listStringDestinationZone',
   dataStringDestinationZone: 'dataStringDestinationZone',
   dataFacility: 'datafacility',
   listStringBoardRoom: 'listStringBoardRoom',
   listStringOffer: 'listStringOffer',
   valuesRange: 'valuesRange',
   //All facilityList 
   AllFacilityList: 'AllFacilityList',
   ...keyFlight,
   //visa
   isInBound: 'isInBound', //boleen: false xuất cảnh, true nhập cảnh.

   // tour
   etourModels: 'etourModels',
   etourValues: 'etourValues',
   notification: 'Notification',
   dataDongTour: 'dataDongTour',
   dataTourType: 'dataTourType',
   DongTourClick: 'DongTourClick',
   TourTypeClick: 'TourTypeClick',
   SeatconditionClick: 'SeatconditionClick',
   TransferinformationClick: 'TransferinformationClick',
   JourneylengthClick: 'JourneylengthClick',
   priceRange: 'priceRange',
   priceFilter: 'priceFilter',
   deviceToken: 'deviceToken',
};