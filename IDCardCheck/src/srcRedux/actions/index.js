import {
    SETCOUNTRY, SETLANGUAGE
} from './type';

export const setCountry = (val) => ({ type: SETCOUNTRY, data: val });
export const setLanguage = (val) => ({ type: SETLANGUAGE, data: val });




