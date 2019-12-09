import { resEN } from './en'
import { resVI } from './vi'
import { appConfig } from '../../Config';
import Utils from '../../Utils';
import { nkey } from '../../keys/keyStore';

//-- Định nghĩa các ngôn ngữ 
const langueSuport =
{
    'en': resEN,
    'vi': resVI
};


const RootLang = {
    lang: resEN,
    _keys: 'en', //not delete
};

function changeLangue(langue) {
    if (langueSuport[langue] == undefined)
        langue = appConfig.defaultLang;
    RootLang.lang = langueSuport[langue];
    RootLang._keys = langue;
    Utils.nsetStore(nkey.lang,langue);
    Utils.setMomentLocale();
}

export { RootLang, changeLangue };




