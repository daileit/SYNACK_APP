import Utils from '../app/Utils';
import { appConfig } from '../app/Config';
const PREFIX = 'api/';


async function apiUploadFront(dataImg, apiKey = 'app_upload_front', domainNew = appConfig.domain, dataImg2 = null) {
    const { uri, codec = "jpg" } = dataImg;
    let dataBody = new FormData();
    dataBody.append("image", {
        name: "face" + '_' + Date.now(),
        type: 'image/' + codec,
        uri
    });
    if (dataImg2 != null) {
        dataBody.append("image", {
            name: "face" + '_' + Date.now(),
            type: 'image/jpg',
            uri: dataImg2 
        });
    }
    // Utils.nlog('xxx1:', dataBody);

    try {
        let response = await fetch(domainNew + apiKey, {
            method: "post",
            headers: {
                "content-type": "multipart/form-data",
            },
            body: dataBody
        });
        const res = await response.json();
        return res;
    } catch (e) {
        console.log('eeeeeee:', e);
        return false;
    }
    //----
    // let res = await Utils.post_api('app_OCR');
    // return res;
}

async function apiUploadBack(data) {
    let res = await apiUploadFront(data, 'app_upload_back');
    return res;
}

async function apiUploadAvatar(data) {
    let res = await apiUploadFront(data, 'app_upload_face', appConfig.domain88);
    return res;
}

async function apiUploadFinger(data1, data2) {
    let res = await apiUploadFront(data1, 'app_upload_finger', appConfig.domain88, data2);
    return res;
}

async function apiUploadTemplate(data) {
    let res = await apiUploadFront(data, 'app_upload_template', appConfig.domain88);
    return res;
}

//---Get Result

async function apiConnect() {
    let res = await Utils.get_api('app_connect');
    return res;
}

async function apiGetKQORC() {
    let res = await Utils.get_api('app_ocr_result');
    return res;
}

async function apiGetKQFace() {
    let res = await Utils.get_api('app_face_result', true, appConfig.domain88);
    return res;
}

async function apiGetKQFinger() {
    let res = await Utils.get_api('app_finger_result', true, appConfig.domain88);
    return res;
}

async function apiGetKQTemplate() {
    let res = await Utils.get_api('app_template_result', true, appConfig.domain88);
    return res;
}

export {
    apiConnect, apiUploadFront, apiUploadBack, apiUploadAvatar, apiUploadTemplate, apiUploadFinger,
    apiGetKQFace, apiGetKQORC, apiGetKQTemplate, apiGetKQFinger
}