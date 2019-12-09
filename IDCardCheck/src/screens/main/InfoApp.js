import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert, TouchableOpacity, ScrollView, ActivityIndicator
} from 'react-native';

import { nstyles, Width } from '../../styles/styles';
import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { Images } from '../../images';
import Video from 'react-native-video'
import HeaderCom from '../../components/HeaderCom';
import { colors } from '../../styles';
import { RootLang } from '../../app/data/locales';
import { appConfig } from '../../app/Config';
import { reText } from '../../styles/size';


const stInfoApp = StyleSheet.create({
    imgContent: {
        width: '100%', alignItems: 'center', justifyContent: 'center',
        borderColor: colors.colorGrayIcon, borderWidth: 1, borderRadius: 6
    }
});

export default class InfoApp extends Component {
    constructor(props) {
        super(props);

        this.emp_id = Utils.ngetParam(this, 'emp_id', '0');
        this.state = {
            //data globle
            isLoading: false,
            //-data local
            videoData: undefined

        }
    }

    componentDidMount = async () => {

    }



    render() {

        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainerX}>
                {/* Header  */}
                <HeaderCom
                    titleText={RootLang.lang.Infomation}
                    nthis={this} />
                {/* BODY */}
                <View style={[nstyles.nbody, { alignItems: 'center', paddingTop: '20%', marginHorizontal: '15%' }]}>
                    <Text style={{ marginBottom: 5, fontSize: reText(13), color: colors.colorGrayText }}>Phiên bản: {appConfig.version}</Text>
                    <Text style={{textAlign: 'center', marginVertical: 10}}>Ứng dụng hỗ trợ kiểm tra chứng thực các giấy tờ cá nhân. Ứng dụng đang trong thời gian phát triển hoàn thiện!</Text>
                    <Text>Một sản phẩm của nhóm SYNACK</Text>
                    <Text style={{ fontSize: reText(15), fontWeight: 'bold', marginTop: 20 }}>Copyright @ 2019</Text>
                </View>
            </View>
        );
    }
}

