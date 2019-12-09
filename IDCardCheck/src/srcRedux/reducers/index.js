import { combineReducers } from 'redux';
import {
  setCountry, setLanguage
} from './setData';

export default combineReducers({
  country: setCountry,
  language: setLanguage,
  //----

});