// -- ROOT APP ---
// File quan trọng, thay thế App.js. Khỏi tạo notifi, đa ngôn ngữ.
// Bắt buộc dữ lại. Có thể làm Flash Screen nếu ko dùng màn hình này gì

import React, { Component } from 'react';
import {
    StatusBar, Platform, ActivityIndicator, Image
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'

import Utils from '../app/Utils';
import { nkey } from '../app/keys/keyStore'
import { appConfig } from '../app/Config';
import { colors } from '../styles/color';
import OneSignal from 'react-native-onesignal';
import { changeLangue } from '../app/data/locales';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../images';
import { ROOTGlobal } from '../app/data/dataGlobal';
// import { NativeModules } from 'react-native'

// const { FingerScanModule } = NativeModules;

// --Màn hình Welcome
class RootScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            background: ''
            //----
        };
    }

    onLoadFirst = async () => {
        //--Set up config langue toàn app tại đây------
        let codeLang = await Utils.ngetStore(nkey.lang, appConfig.defaultLang);
        changeLangue(codeLang);
        //------------End set up langue------------
        this.setStatusBar();
    }

    // -- NOTIFI BEGIN --
    async componentDidMount() {
        this.onLoadFirst();
        //----- Open chuc nang Notifi
        OneSignal.init(appConfig.onesignalID);
        OneSignal.inFocusDisplaying(0);

        // this.onReceived = this.onReceived.bind(this);
        // this.onOpened = this.onOpened.bind(this);
        // this.onIds = this.onIds.bind(this);

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        // OneSignal.configure();
        //-----

        this.setStatusBar(false);
        let temp = await Utils.ngetStore(nkey.dataUser, null);
        setTimeout(() => {
            if (temp) {
                ROOTGlobal.dataUser = temp;
                Utils.goscreen(this, 'sw_Main');
            } else
                Utils.goscreen(this, 'sw_Login');
        }, 500);
        // Utils.goscreen(this, 'sc_Transfer', { typePayment: 2 });
        // Utils.goscreen(this, 'sc_OnBoarding');
        // FingerScanModule.showText('2222222',FingerScanModule.LENGTH_LONG);
    };


    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onIds = async (device) => {
        //------
        Utils.nlog('Init Notification: ', device);
    }

    onReceived(notification) {
        Utils.nlog("Notification received: ", notification);
    }

    onOpened(openResult) {
        Utils.nlog("onOpened", openResult);
        // setTimeout(() => {
        //     Utils.goscreen(this, 'sc_Home');
        // }, 700);
    }
    // -- NOTIFI END --

    // ẩn thanh status bar khi Loadding
    setStatusBar = (val = true) => {
        if (!isIphoneX()) {
            StatusBar.setHidden(val);
        }
    };

    render() {
        return (
            <LinearGradient
                start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}
                colors={[colors.white, colors.white]}
                style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={Images.iconApp} style={{ width: 200, height: 200 }} resizeMode='contain' />
                <ActivityIndicator size="large" color={colors.greenFE} style={{ marginBottom: 20 }} />
            </LinearGradient>
        );
    }
}

export default Utils.connectRedux(RootScreen, null, true);
