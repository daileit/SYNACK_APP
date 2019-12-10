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


const stRegisFace = StyleSheet.create({
    imgContent: {
        width: '100%', alignItems: 'center', justifyContent: 'center',
        borderColor: colors.colorGrayIcon, borderWidth: 1, borderRadius: 6
    }
});

export default class RegisFace extends Component {
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

    renderStatusBar = (index, text = '') => {
        return (
            <View style={{ flex: 1, marginHorizontal: 2, alignItems: 'center' }}>
                <View style={{ height: 30, width: '100%', backgroundColor: 'red' }}>

                </View>
                <Text>{text}</Text>
            </View>
        )
    }

    onOpenCam = (optionsCus = {}) => {
        //--Open dialog camera- ncustom
        response = (res) => {
            if (res.iscancel) {
                //--ko chon item or back
            }
            else if (res.error) {
                //--lỗi khi record video
            }
            else {
                //--dữ liệu media trả về là 1 item or 1 mảng item
                //--Xử lý dữ liệu trong đây-----
                Utils.nlog('res onRecordVideo:', res);
                this.setState({ videoData: res });
                //-----
            }
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

    onNext = async () => {
        if (!this.state.videoData) {
            Utils.showMsgBoxOK(this, 'Cảnh báo', 'Vui lòng ghi hình khuôn mặt')
            return;
        }
        this.setState({ isLoading: true });
        // let base64Temp = await Utils.parseBase64(this.state.videoData);
        // Utils.nlog('BASE64:',base64Temp);
        let res = await uploadFace(this.state.videoData, this.emp_id);
        this.setState({ isLoading: false });
        Utils.nlog('OK UPLOAD:', res)
        if (res == 'File successfully uploaded') {
            Utils.showMsgBoxOK(this, 'Đăng ký thành công', 'Đã hoàn tất gửi đăng ký khuôn mặt', 'OK', () => {
                Utils.goback(this);
            });
        } else {
            Utils.showMsgBoxOK(this, 'Đăng ký thất bại', 'Gửi đăng ký thất bại. Vui lòng kiểm tra lại');
        }
    }

    render() {
        let tempWith = Width(40);

        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainerX}>
                {/* Header  */}
                <HeaderCom
                    titleText={'Đăng ký khuôn mặt'}
                    nthis={this} />
                {/* BODY */}
                <View style={nstyles.nbody}>
                    <ScrollView>
                        <View style={[nstyles.nbody, { paddingTop: 20 }]}>
                            {/* <View style={[nstyles.nrow, { marginHorizontal: 15 }]}>
                                {this.renderStatusBar(0, 'Bước 1')}
                                {this.renderStatusBar(1, 'Bước 2')}
                                {this.renderStatusBar(3, 'Bước 3')}
                            </View> */}
                            <Text style={{ textAlign: 'center', marginHorizontal: '15%', marginVertical: '8%' }}>
                                Vui lòng gửi video khuôn mặt chân thật về khuôn mặt của bạn.
                        </Text>

                            {/* Khung chon Avatar + Fingerprint */}
                            <View style={{
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                marginHorizontal: 15, marginTop: 20
                            }}>
                                <View style={{ width: tempWith, alignItems: 'center' }}>
                                    <TouchableOpacity style={[stRegisFace.imgContent, { height: tempWith * 4 / 3 }]} onPress={this.onOpenCam}>
                                        {
                                            this.state.videoData ?
                                                <Video
                                                    source={{ uri: this.state.videoData.uri }}
                                                    paused={true}                                  // Store reference
                                                    style={{ width: '100%', height: '100%', borderRadius: 6 }}
                                                    resizeMode='cover'
                                                /> :
                                                <Image source={Images.icUser} style={nstyles.nIcon65} resizeMode='cover' />
                                        }
                                    </TouchableOpacity>
                                    <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Ghi hình khuôn mặt</Text>
                                </View>

                                {/* <Image source={{ uri: this.state.videoData }} style={{ width: '100%', height: '100%' }}  resizeMode='cover' /> */}

                                {/* <View style={{ width: 10 }} />
                                <View style={{ width: tempWith, alignItems: 'center' }}>
                                    <TouchableOpacity style={[stRegisFace.imgContent, { height: tempWith * 4 / 3 }]}>
                                        <Image source={Images.icFinger} style={nstyles.nIcon65} resizeMode='cover' />
                                    </TouchableOpacity>
                                    <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Quét vân tay</Text>
                                </View> */}
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
                    text={"GỬI ĐĂNG KÝ"}
                />
            </View>
        );
    }
}

