import { Alert, NetInfo, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import isUrl from 'is-url'
import { appConfig } from './Config';
import { AppgetGlobal, AppgetRootGlobal, AppsetGlobal, ROOTGlobal } from './data/dataGlobal';
import Moment from 'moment';
import { RootLang } from './data/locales';
import * as actions from '../srcRedux/actions';
import { connect } from 'react-redux';
import { getObjDateFormat } from './data/dateLocales';
import ImageEditor from "@react-native-community/image-editor";
import RNFS from 'react-native-fs';
import { nGlobalKeys } from './keys/globalKey';
import Share from 'react-native-share';
if (Platform.OS === 'android') { // only android needs polyfill
    require('intl'); // import intl object
    require('intl/locale-data/jsonp/en-US'); // load the required locale details
    require('intl/locale-data/jsonp/vi-VN'); // load the required locale details
}


// const shareOptions = {
//     title: 'Share via',
//     message: 'some message',
//     url: 'some share url',
//     social: Share.Social.WHATSAPP,
//     whatsAppNumber: "9199999999"  // country code + phone number(currently only works on Android)
//     filename: 'test' , // only for base64 file in Android 
// };
// Share.shareSingle(shareOptions);
// --call API
// -1 Lỗi không lấy dữ liệu, -2 lỗi không lấy được token, -3 lỗi API

// 'Accept': 'application/json',
// 'Content-Type': 'application/json',
async function post_api(strUrl, strBody = '', showMsg = true, domainOption = appConfig.domain) {
    var smethod = 'POST';
    if (strBody == '')
        smethod = 'GET'
    let token = ROOTGlobal.loginToken;
    if ((token == null || token.length < 3) && false) {
        if (showMsg)
            Alert.alert('Bảo mật', 'Không tồn tại token người dùng');
        return -2;
    }

    try {
        const response = await fetch(domainOption + strUrl,
            {
                method: smethod,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: strBody
            });
        const res = await response.json();
        nlog('xxx2:', domainOption + strUrl, res);
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            nlog('[API]Lỗi API:', res);
            return -3;
        }
        return res;
    }
    catch (error) {
        nlog('[API]Lỗi error:', error);
        if (showMsg)
            Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
        return -1;
    }
}

function connectRedux(Component, StateToProps = null, isActions = false) {
    return connect(StateToProps, isActions ? actions : null)(Component);
}

async function post_apiBear(strUrl, strBody = '', showMsg = true, chktoken = true) {
    var smethod = 'POST';
    if (strBody == '')
        smethod = 'GET'
    let token = ROOTGlobal.loginToken;
    token = 'Bearer ' + token;
    if ((token == null || token.length < 3) && chktoken) {
        if (showMsg)
            Alert.alert('Bảo mật', 'Không tồn tại token người dùng');
        return -2;
    }
    try {
        const response = await fetch(appConfig.domain + strUrl,
            {
                method: smethod,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: strBody
            });
        const res = await response.json();
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            nlog('[API]Lỗi API:', res);
            return -3;
        }
        return res;
    }
    catch (error) {
        nlog('[API]Lỗi error:', error);
        if (showMsg)
            Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
        return -1;
    }
}

async function get_apiBearer(strUrl, showMsg = true, chktoken = true) {
    const res = await post_apiBear(strUrl, '', showMsg, chktoken);
    return res;
}

// -1 Lỗi không lấy dữ liệu, -2 lỗi không lấy được token, -3 lỗi API
async function get_api(strUrl, showMsg = false, domainOption = appConfig.domain) {
    const res = await post_api(strUrl, '', showMsg, domainOption);
    return res;
}

// -- custom AynsStore
function ngetParam(nthis, keys, defaultValue) {
    let param = nthis.props.navigation.getParam(keys, defaultValue);
    return param;
}

// --


//--Thông số cấu hình mặc

function nlog(...val) {
    console.log(...val);
}

// -- custom AynsStore
async function ngetStore(keys, defaultValue = null) {
    let temp = await AsyncStorage.getItem(keys);
    if (temp == null)
        return defaultValue;
    try {
        let tempValue = JSON.parse(temp);
        return tempValue;
    } catch (error) {
        return temp;
    }

}

async function nsetStore(keys, value) {
    if (typeof (value) !== 'string')
        value = JSON.stringify(value);
    await AsyncStorage.setItem(keys, value);
}
// --

// --navigation, [core] pass param on all of app
function goscreen(nthis, routeName, param = null) {
    if (param) {
        nthis.props.navigation.navigate(routeName,
            { ...param, lang: nthis.lang });
    } else {
        nthis.props.navigation.navigate(routeName,
            { lang: nthis.lang });
    }
}

function goback(nthis, routeName = '') {
    if (routeName == '')
        nthis.props.navigation.goBack();
    else nthis.props.navigation.goBack(routeName);
}

/**
 * @deprecated
 * @param {*} nthis 
 * @param {*} isClose 
 * @param {*} mode 
 */
function toggleDrawer(nthis, isClose = false, mode = 'toggleDrawer') {
    // if (isClose)
    //     nthis.props.navigation.closeDrawer();
    // else {
    //     nthis.props.navigation[mode]();
    // }
}

// -- Alert native, custom call func
function msgAlert(title, message = '', btnTextOk = 'OK', onPress = () => { }) {
    setTimeout(() => {
        Alert.alert(title, message, [{ text: btnTextOk, onPress }]);
    }, 520);
}

function msgAlertYesNo(title, message = '', btnTextYes = 'Xác nhận', btnTextNo = 'Xem lại', funcYes = () => { nlog('is Yes') }, funcNo = function () { console.log('is No') }) {
    Alert.alert(
        title,
        message,
        [
            { text: btnTextNo, onPress: funcNo },
            { text: btnTextYes, onPress: funcYes, style: 'cancel' }
        ],
        { cancelable: false }
    )
}

// -- Alert custom 
function showMsgBoxOK(nthis, title, message = '', btnTextOk = 'OK', onPressOK = () => { }) {
    goscreen(nthis, 'Modal_MsgBox', { title, message, buttons: [{ text: btnTextOk, onPress: onPressOK }] });
}

function showMsgBoxYesNo(nthis, title, message = '', btnTextOk = 'OK', btnTextCancel = 'Cancel', onPressOK = () => { }, onPressCancel = () => { }) {
    goscreen(nthis, 'Modal_MsgBox', { title, message, buttons: [{ text: btnTextOk, onPress: onPressOK }, { text: btnTextCancel, onPress: onPressCancel }] });
}

// -- get domain from a link. ex: abc.com/home/abc -> abc.com
function getDomain(url) {
    if (url == undefined || url == null)
        url = '';
    len = 0;
    count = 0;
    for (let index = 0; index < url.length; index++) {
        const element = url[index];
        if (element == '/')
            count++;
        if (count == 3)
            break;
        len++;
    }
    return url.substr(0, len);
}

// -- check the link is a uri
function isUrlCus(val) {
    if (isUrl(val))
        return val;
    urls = ['google.com',
        'facebook.com',
        'youtube.com',
        'zing.vn',
        'vnexpress.net',
        '24h.com.vn',
        'dkn.tv',
        'amazon.com',
        'webtretho.com',
        'wikipedia.org']
    for (let i = 0; i < urls.length; i++) {
        if (val.toLowerCase().indexOf(urls[i]) == 0) {
            return 'http://' + urls[i];
        }
    }
    return '';
}

// -- open uri on Website in App
function openWeb(nthis, link, params) {
    let optionDef = { //option default
        istitle: false,
        title: '',
        isEditUrl: false,
        isHtml: false
    };
    goscreen(nthis, 'Modal_BrowserInApp', { goback: goback, link, ...optionDef, ...params });
}

// --format
function formatMoney(value) {
    var stemp = '';
    var svalue = value.toString();
    let icount = 0;
    for (var i = svalue.length - 1; i >= 0; i--) {
        stemp = svalue[i] + stemp;
        icount++;
        if (icount == 3 && i > 0) {
            icount = 0;
            stemp = ',' + stemp;
        }
    }
    return stemp;
}

function formatMoney1(number) {
    let objCurrency = null;
    switch (nGlobalKeys.currency) {
        case 'VND':
            objCurrency = { locales: 'vi-VN', currency: nGlobalKeys.currency };
            break;
        case 'USD':
            objCurrency = { locales: 'en-US', currency: nGlobalKeys.currency };
            break;
        default:
            break;
    };
    const money = new Intl.NumberFormat(objCurrency.locales, { style: 'currency', currency: objCurrency.currency }).format(number);
    return money;
}


function inputMoney(value, isNeg = false, dec = 9) {
    if (value == undefined)
        value = '0';
    let stemp = '';
    let svalue = value.toString();
    //check dấu âm
    let iam = "";
    if (isNeg && svalue.length > 0 && svalue[0] == '-') {
        iam = "-";
    }
    //xoá ký tự khác số trước khi format
    for (let i = 0; i < svalue.length; i++) { //xoá tất cả kí tự không phải là số hợp lệ
        let tchar = svalue[i];
        if (tchar != '.' && isNaN(parseInt(tchar)))
            while (true) {
                svalue = svalue.replace(tchar, "");
                if (!svalue.includes(tchar)) {
                    i = i - 1;
                    break;
                }
            };
    }
    //kiểm tra lấy thập phân
    let mval = svalue.split('.');
    let thapphan = '';
    if (mval.length >= 2) {
        svalue = mval[0].slice();
        thapphan = mval[1];
        if (dec != 0 && thapphan == '')
            thapphan = '.';
        else {
            thapphan = thapphan.substr(0, thapphan.length < dec ? thapphan.length : dec);
            thapphan = '.' + thapphan;
        }
    }
    //format chuỗi số
    if (!isNaN(parseFloat(svalue)))
        svalue = parseFloat(svalue).toString();
    let icount = 0;
    for (let i = svalue.length - 1; i >= 0; i--) {
        stemp = svalue[i] + stemp;
        icount++;
        if (icount == 3 && i > 0) {
            icount = 0;
            stemp = ',' + stemp;
        }
    }
    if (stemp == '')
        stemp = "0";
    else
        stemp = iam + stemp;
    return stemp + thapphan;
}

function formatNumber(value) {
    if (value == null || value == undefined || value == '' || isNaN(parseFloat(value)))
        value = '0';
    for (let i = 0; i < value.length; i++) {
        const inum = value[i];
        if (isNaN(parseFloat(inum)) && inum != ".") {
            value = value.replace(inum, "");
            i--;
        }
    }
    return parseFloat(value);
}

// -- Các hàm xử lý thao tác với biến gốc rootGlobal
// Hàm get giá trị theo keys - read only. Giá trị thay đổi không làm thay đổi giá trị root
function getGlobal(keys, defaultValue) {
    return AppgetGlobal(keys, defaultValue);
}
// Hàm get giá trị gốc theo keys - read write. Giá trị thay đổi làm thay đổi giá trị root
function getRootGlobal(keys, defaultValue) {
    return AppgetRootGlobal(keys, defaultValue);
}
// Hàm khởi tạo một biến gốc, cũng có thể dùng để thay đổi một gốc.
function setGlobal(keys, value) {
    AppsetGlobal(keys, value);
}
//--

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,3}))$/;
    return re.test(email);
}

let resTrue = (data = '', message = 'Xử lý thành công') => {
    return {
        ...data,
        status: 1,
        title: 'Thông báo',
        message
    }
}

let resFalse = (res = null, message = 'Xử lý thất bại') => {
    try {
        if (res.data != undefined || res.error != undefined || res.status != undefined || res.message != undefined)
            return {
                data: null,
                status: 0,
                title: 'Cảnh báo',
                message,
                ...res
            }
        return {
            data: res,
            status: 0,
            title: 'Cảnh báo',
            message
        }
    } catch (error) {
        return {
            data: res,
            status: 0,
            title: 'Cảnh báo',
            message
        }
    }
}

let resEmpty = (message = 'Vui lòng nhập đủ dữ liệu!') => {
    return {
        data: null,
        status: -1,
        title: 'Cảnh báo',
        message
    }
}


function handleResponse(res, isTrue = false) {
    if (res < 0 || res.status == undefined && !isTrue)
        return resFalse(res);
    if (res.status >= 1 || isTrue) { //ok 
        return resTrue(res);
    }
    return resFalse(res);
}

function handleSelectedDate(date) {
    let str = date.toString().split(' ');
    let selectedDate = str[2] + ' ' + str[1] + ' ' + str[3];
    return selectedDate;
}

function formatPhoneCode(phoneCode) {
    let value = phoneCode;
    if (value[0] != '+') {
        value = '+' + value;
    }
    return value;
}

function formatDate(dates, format, location = RootLang._keys, isMoment = false) {
    if (!isMoment)
        dates = new Date(dates.toString());
    return Moment(dates).format(format);
}


function setMomentLocale(location = RootLang._keys) {
    // Moment.locale(location); // ko áp dụng được cho đa ngôn ngữ, đang lỗi. xem Doc lại
}

//*****
// Cách dùng như format bình thường, sẽ có thể tuỳ chỉnh Thứ và Tháng.
// Thứ có 2 fortmat: d và ddd.   -vd: 'ddd, DD M YYYY' -> Thứ 2, 20 Thg 2 2019
// Tháng có 2 fortmat: M và MMM. -vd: 'd, DD-MM-YYYY' -> T2, 20-02-2019
// Nếu muốn chữ thường hết thì nên dùng formatDateApp(...).toLowerCase();
// Còn lại sẽ lấy theo format Chuẩn.
// *Chú ý: theo 1 chuyển duy nhất, nếu giao diện để QUÁ khác những cái đang có thì bỏ quả.
//*****
function formatDateApp(dates, format, lang = RootLang._keys) {
    dates = new Date(dates.toString());
    let objFormatDate = getObjDateFormat(lang); // get dữ liêu format custom
    let arrFormat = [];
    let temp = '';
    for (let i = 0; i < format.length; i++) {
        const char = format[i];
        if (char.toLowerCase() == 'd' || char.toLowerCase() == 'm' || char.toLowerCase() == 'y') {
            temp += char;
            if (i != format.length - 1)
                continue;
        };
        if (temp != '') {
            arrFormat.push(temp);
            temp = ''
        };
    };
    //--xử lý trả về kết quả
    let result = format;
    for (let i = 0; i < arrFormat.length; i++) {
        const item = arrFormat[i];
        switch (item) {
            case 'd':
            case 'ddd':
                let tempD = dates.getDay();
                result = result.replace(item, objFormatDate[item][tempD]);
                break;
            case 'M':
            case 'MMM':
                let tempM = dates.getMonth();
                result = result.replace(item, objFormatDate[item][tempM]);
                break;
            default:
                result = result.replace(item, Moment(dates).format(item));
                break;
        };
    };
    return result;
}

// tính khoảng cách giữa 2 ngày
function datesDiff(date1, date2, isSecond = false, isFloat = false) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    //isFloat:trả về số lẻ or nguyên, mặc định trả về số nguyên 
    //isSecond:trả ngày or giây,  mặc dinh trả về số ngày days  
    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    if (isSecond)
        oneDay = 1000;
    let diffDays = Math.round(Math.abs((date2.getTime() - date1.getTime()) / (oneDay)));
    if (isFloat)
        diffDays = Math.abs((date2.getTime() - date1.getTime()) / (oneDay));
    return diffDays;
};
// truyền vào second trả về mảng [day, hour, minute, second]
function sformat(s) {
    let fm = [
        Math.floor(s / 60 / 60 / 24), // DAYS
        Math.floor(s / 60 / 60) % 24, // HOURS
        Math.floor(s / 60) % 60, // MINUTES
        s % 60 // SECONDS
    ];
    return fm
}


/**
 * @description Mở link url 
 * @param {*} url 
 */
function openUrl(url) {
    Linking.canOpenURL(url).then(supported => {
        if (!supported) {
            console.log('Can\'t handle url: ' + url);
        } else {
            return Linking.openURL(url);
        }
    }).catch(err => console.error('An error occurred', err));
}

/**
 * @description Trả về queryStrings cho param phương thức get.
 * @param {*} param Là 1 object chứa các param của phương 
 */
function objToQueryString(param) {
    const keyValuePairs = [];
    for (const key in param) {
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(param[key]));
    }
    return keyValuePairs.join('&');
}
// function decodeHTML
var entities = {
    'amp': '&',
    'apos': '\'',
    'lt': '<',
    'gt': '>',
    'quot': '"',
    'nbsp': '\xa0'
};
var entityPattern = /&([a-z]+);/ig;

function decodeHTMLEntities(text) {
    // A single replace pass with a static RegExp is faster than a loop
    return text.replace(entityPattern, function (match, entity) {
        entity = entity.toLowerCase();
        if (entities.hasOwnProperty(entity)) {
            return entities[entity];
        }
        // return original string if there is no matching entity (no replace)
        return match;
    });
};

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isNullOrUndefined(value) {
    return !(!!value);
}

function isNullOrEmpty(value) {
    return !(!!value) || value == '';
}

function cloneData(data) {
    let _data = JSON.parse(JSON.stringify(data));
    return _data;

}

async function parseBase64(uri, height, width, downSize = 0.3) {
    try {
        let uriReturn = uri;
        if (height) {
            uriReturn = await ImageEditor.cropImage(
                uri,
                {
                    offset: { x: 0, y: 0 },
                    size: { width, height },
                    displaySize: { width: width * downSize, height: height * downSize },
                    resizeMode: 'contain'
                }
            );
        }
        if (uriReturn) {
            //-------
            try {
                const data64 = await RNFS.readFile(uriReturn, 'base64');
                //POSTDATA
                return data64;
            } catch (error) {
                return '';
            };
        };
    } catch (cropError) {
        return '';
    };
}


async function resizeImg(uri, height, width, downSize = 0.3) {
    try {
        let uriReturn = uri;
        uriReturn = await ImageEditor.cropImage(
            uri,
            {
                offset: { x: 0, y: 0 },
                size: { width, height },
                displaySize: { width: width * downSize, height: height * downSize },
                resizeMode: 'contain'
            }
        );
        return uriReturn;
    } catch (cropError) {
        return '';
    };
}
// random UUID/GUID
// function uuidv4() {
//     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
//         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//     )
// }

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function openCallNumber(phone = ROOTGlobal.hotlineTripU) {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
        phoneNumber = 'telprompt:19009066';
    } else {
        phoneNumber = 'tel:19009066';
    };
    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                Alert.alert('Phone number is not available', phone);
            } else {
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(err => console.log(err));
};

function onShare(data = {}) {
    const shareOptions = {
        title: 'TripU',
        message: 'Wellcom to TripU',
        url: 'https://tripu.vn',
        subject: 'Share TripU',
        // social: Share.Social.WHATSAPP,
        // whatsAppNumber: "9199999999"  // country code + phone number(currently only works on Android)
        // filename: 'test', // only for base64 file in Android 
    };
    Share.open(shareOptions)
        .then((res) => { console.log('SSSSS:', res) })
        .catch((err) => { err && console.log('SSSSS:', err); });
}

//-------END---------
export default {
    goscreen, nlog, goback, isUrlCus, getDomain, openWeb, showMsgBoxOK, showMsgBoxYesNo, getRootGlobal, setGlobal,
    formatMoney, inputMoney, formatNumber, post_api, get_api, validateEmail, handleResponse, getGlobal,
    resTrue, resFalse, resEmpty, toggleDrawer, handleSelectedDate, ngetStore, nsetStore, ngetParam,
    post_apiBear, get_apiBearer, formatPhoneCode, datesDiff, formatDate, sformat,
    openUrl, objToQueryString, decodeHTMLEntities, capitalize, connectRedux, isNullOrUndefined, isNullOrEmpty,
    formatDateApp, cloneData, parseBase64, formatMoney1, uuidv4, setMomentLocale, openCallNumber, onShare, resizeImg
};