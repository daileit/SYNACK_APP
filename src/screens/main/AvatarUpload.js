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
import ButtonCom from '../../components/Button/ButtonCom';
import { uploadFace } from '../../apis/apiapp';
import { RootLang } from '../../app/data/locales';
import { apiUploadAvatar, apiUploadFinger } from '../../apis/apiCMND';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { appConfig } from '../../app/Config';


const stAvatarUpload = StyleSheet.create({
    imgContent: {
        width: '100%', alignItems: 'center', justifyContent: 'center',
        borderColor: colors.colorGrayIcon, borderWidth: 1, borderRadius: 6
    }
});

export default class AvatarUpload extends Component {
    constructor(props) {
        super(props);
        this.statusStep = 1;
        this.emp_id = Utils.ngetParam(this, 'emp_id', '0');
        this.state = {
            //data globle
            isLoading: false,
            //-data local
            videoData: undefined,
            fingerprint: undefined,
            fingerprint2: undefined,
            isLoading1: false,
            isLoading2: false,
            status1: '',
            status2: ''

        }
    }

    componentDidMount = async () => {

    }

    renderStatusBar = (index, text = '') => {
        let colormain = colors.waterBlue;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', width: '100%', height: 40 }}>
                    <Image source={Images.icDashLine} style={{ width: '37%', height: '100%', tintColor: colormain, opacity: index == 0 ? 0 : 1 }} resizeMode='stretch' />
                    <Image source={index <= this.statusStep ? Images.icRadioCheck : Images.icRadioEmpty} style={{ width: '26%', height: '100%', tintColor: colormain }} resizeMode='contain' />
                    <Image source={Images.icDashLine} style={{
                        width: '37%', height: '100%', tintColor: colormain,
                        opacity: index == 2 || index == 1 && this.typeCheck == 2 ? 0 : 1
                    }} resizeMode='stretch' />
                </View>
                <Text style={{ fontWeight: '600', color: colors.oceanBlue }}>{text}</Text>
            </View>
        )
    }

    onOpenCam = (optionsCus = {}) => {
        //--Open dialog camera- ncustom
        response = async (item) => {
            this.setState({ videoData: item.uri, isLoading1: true });
            let res = await apiUploadAvatar(item);
            let tempURI = item.uri;
            let status1 = 'Valid';
            if (res.error || !res) {
                status1 = 'Invalid';
                tempURI = undefined;
                Utils.showMsgBoxOK(this, 'Ảnh chụp không hợp lệ', 'Vui lòng chụp ảnh khuôn mặt trong khung xanh')
            } else {
                ROOTGlobal['facedata'] = res.stt;
                ROOTGlobal['faceUri'] = item.uri;
            }
            this.setState({ videoData: tempURI, isLoading1: false, status1 });
            console.log('onResponse3xxx:', res);

        };
        options = {
            response,
            typeDefault: 'front', //mac dinh chonj camera truoc/sau. - back-front : sau-truoc 
            showLeft: false, //hiên thị button left
            showRight: false, //hiên thị button right
            isAudio: false,
            ...optionsCus
        };
        Utils.goscreen(this, 'Modal_RecordVideoCus1', options);
        //--End dialog media
    }

    onScanFinger = () => {
        //--tam thời để chọn ảnh, sau khi găn module thì tự lấy theo hình trả về
        response = async (item) => {
            if (item.iscancel)
                return;
            ROOTGlobal['finger1'] = undefined;
            item.uri = await Utils.resizeImg(item.uri, item.height, item.width, item.width > 500 ? 0.2 : 1);
            this.setState({ fingerprint: item.uri, isLoading2: true });
            let res = await apiUploadFinger(item, appConfig.domain88 + 'app_get_finger');
            let tempURI = item.uri;
            let status2 = 'Valid';
            if (res.error || !res) {
                status2 = 'Invalid';
                tempURI = undefined;
                Utils.showMsgBoxOK(this, 'Vân tay không hợp lệ', 'Vui lòng chọn ảnh vân tay của bạn')
            } else {
                ROOTGlobal['fingerResult'] = res.stt;
                ROOTGlobal['fingerUri'] = item.uri;
            }
            this.setState({ fingerprint: tempURI, isLoading2: false, status2 });
            console.log('onResponse4xxx:', res);

        };
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response, // callback giá trị trả về khi có chọn item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All'
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
        //--End dialog media
    }

    onScanFinger2 = () => {
        //--tam thời để chọn ảnh, sau khi găn module thì tự lấy theo hình trả về
        response = async (items) => {
            if (items.iscancel)
                return;
            if (items.length == 1)
                return;
            console.log('onResponse5xxx:', items);
            let item1 = items[0];
            item1.uri = await Utils.resizeImg(item1.uri, item1.height, item1.width, item1.width > 500 ? 0.2 : 1);
            let item2 = items[1];
            item2.uri = await Utils.resizeImg(item2.uri, item2.height, item2.width, item2.width > 500 ? 0.2 : 1);
            ROOTGlobal['finger1'] = item1.uri;
            this.setState({ fingerprint: item2.uri, isLoading2: true });
            let res = await apiUploadFinger(item2, item1);
            let status2 = 'Valid';
            if (res.error || !res) {
                status2 = 'Invalid';
                Utils.showMsgBoxOK(this, 'Vân tay không hợp lệ', 'Vui lòng chọn ảnh vân tay của bạn')
            } else {
                ROOTGlobal['fingerResult'] = res.stt;
                ROOTGlobal['fingerUri'] = item2.uri;
            }
            this.setState({ isLoading2: false, status2 });
            console.log('onResponse5xxx:', res);
        };
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: true,// chọn 1 or nhiều item
            response, // callback giá trị trả về khi có chọn item
            limitCheck: 2, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All'
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
        //--End dialog media
    }

    onNext = async () => {
        const { isLoading1, isLoading2, videoData, fingerprint } = this.state;
        if (!isLoading1 && videoData) {
            Utils.goscreen(this, 'scResultCheck', {});
            return;
        }
        Utils.showMsgBoxOK(this, 'Cảnh báo', 'Vui lòng nhập thông tin xác thực đầy đủ trước khi tiếp tục');

        // if (!this.state.videoData) {
        //     Utils.showMsgBoxOK(this, 'Cảnh báo', 'Vui lòng ghi hình khuôn mặt')
        //     return;
        // }
        // Utils.goscreen(this, 'scResultCheck', {});
    }

    render() {
        let tempWith = Width(40);

        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainerX}>
                {/* Header  */}
                <HeaderCom
                    titleText={RootLang.lang.Faceandfingerprintauthentication}
                    nthis={this} />
                {/* BODY */}
                <View style={nstyles.nbody}>
                    <ScrollView>
                        <View style={[nstyles.nbody, { paddingTop: 20 }]}>
                            <View style={[nstyles.nrow, { marginHorizontal: 15 }]}>
                                {this.renderStatusBar(0, RootLang.lang.Step + ' 1')}
                                {this.renderStatusBar(1, RootLang.lang.Step + ' 2')}
                                {this.renderStatusBar(2, RootLang.lang.Step + ' 3')}
                            </View>
                            <Text style={{ textAlign: 'center', marginHorizontal: '15%', marginVertical: '10%' }}>
                                {RootLang.lang.Pleasesend_face}
                            </Text>
                            <TouchableOpacity style={{ opacity: 0.5, padding: 5, paddingHorizontal: 10, alignItems: 'center' }}
                                onPress={this.onScanFinger2}>
                                <Text>DEV MODE</Text>
                            </TouchableOpacity>
                            {/* Khung chon Avatar + Fingerprint */}
                            <View style={{
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                marginHorizontal: 15, marginTop: 20
                            }}>
                                <View style={{ width: tempWith, alignItems: 'center' }}>
                                    <TouchableOpacity style={[stAvatarUpload.imgContent, { height: tempWith * 4 / 3 }]} onPress={this.onOpenCam}>
                                        {
                                            this.state.videoData ?
                                                <Image source={{ uri: this.state.videoData }} style={{ width: '100%', height: '100%' }}
                                                    resizeMode='cover' /> :
                                                <Image source={Images.icUser} style={nstyles.nIcon65} resizeMode='cover' />
                                        }
                                    </TouchableOpacity>
                                    <View style={[nstyles.nrow, { alignItems: 'center', marginTop: 10 }]}>
                                        {this.state.isLoading1 ? <ActivityIndicator color={colors.greenyBlue} /> : null}
                                        <Text style={{ fontWeight: 'bold', marginLeft: 5 }}>{RootLang.lang.Take_faces}</Text>
                                    </View>
                                    <Text style={{ color: this.state.status1 == 'Invalid' ? 'red' : colors.colorGreen, fontWeight: '600', fontStyle: 'italic', marginTop: 5 }}>
                                        {this.state.status1}</Text>

                                </View>


                                <View style={{ width: 10 }} />
                                <View style={{ width: tempWith, alignItems: 'center' }}>
                                    <TouchableOpacity style={[stAvatarUpload.imgContent, { height: tempWith * 4 / 3 }]} onPress={this.onScanFinger}>
                                        {
                                            this.state.fingerprint ? <Image source={{ uri: this.state.fingerprint }} style={{ width: '100%', height: '100%' }}
                                                resizeMode='cover' /> :
                                                <Image source={Images.icFinger} style={nstyles.nIcon65} resizeMode='cover' />
                                        }
                                    </TouchableOpacity>
                                    <View style={[nstyles.nrow, { alignItems: 'center', marginTop: 10 }]}>
                                        {this.state.isLoading2 ? <ActivityIndicator color={colors.greenyBlue} /> : null}
                                        <Text style={{ fontWeight: 'bold', marginLeft: 5 }}>{RootLang.lang.Fingerprintscan}</Text>
                                    </View>
                                    <Text style={{ color: this.state.status2 == 'Invalid' ? 'red' : colors.colorGreen, fontWeight: '600', fontStyle: 'italic', marginTop: 5 }}>
                                        {this.state.status2}</Text>
                                </View>
                            </View>

                        </View>
                    </ScrollView>
                </View>
                {/* Nut gui */}
                {
                    this.state.isLoading ? <ActivityIndicator size='small' color={colors.greenFE} /> : null
                }
                <ButtonCom
                    disabled={this.state.isLoading}
                    onPress={this.onNext}
                    Linear={true}
                    sizeIcon={30}
                    style={{ marginHorizontal: '15%', marginTop: 10, marginBottom: 20 }}
                    text={RootLang.lang.Verifyinformation}
                />
            </View>
        );
    }
}

