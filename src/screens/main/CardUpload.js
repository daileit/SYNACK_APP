import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert, TouchableOpacity, ScrollView, ActivityIndicator
} from 'react-native';

import { nstyles, Width } from '../../styles/styles';
import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { Images } from '../../images';
import HeaderCom from '../../components/HeaderCom';
import { colors } from '../../styles';
import ButtonCom from '../../components/Button/ButtonCom';
import { RootLang } from '../../app/data/locales';
import { apiUploadFront, apiUploadBack, apiUploadTemplate } from '../../apis/apiCMND';
import { ROOTGlobal } from '../../app/data/dataGlobal';


const stCardCheck = StyleSheet.create({
    imgContent: {
        width: '100%', height: Width(60 / 2), alignItems: 'center', justifyContent: 'center',
        borderRadius: 6
    }
});

export default class CardUpload extends Component {
    constructor(props) {
        super(props);
        this.typeCheck = Utils.ngetParam(this, 'typeCheck', 1); //1: check CMND chuẩn, 2: check template CMND
        this.statusStep = 0;
        this.state = {
            //data globle
            isLoading: false,
            //-data local
            optionSelect: 0,
            imgFront: undefined,
            imgBack: undefined,
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

    renderOption = (id, name = '') => {
        return (
            <TouchableOpacity key={id.toString()} style={{ flex: 1, marginHorizontal: 2, alignItems: 'center' }}>
                <Image style={nstyles.nIcon28} source={this.state.optionSelect == id ? Images.icRadioSelected : Images.icRadioEmpty} />
                <Text style={{ width: '100%', textAlign: 'center', marginHorizontal: 3, marginTop: 5 }}>{name}</Text>
            </TouchableOpacity>
        )
    }

    onNext = () => {
        const { isLoading1, isLoading2, imgBack, imgFront } = this.state;
        if (this.typeCheck == 1) { //xử lý face, orc, finger check
            if (!isLoading1 && !isLoading2 && imgBack && imgFront) {
                Utils.goscreen(this, 'scAvatarUpload', {});
                return;
            }
            Utils.showMsgBoxOK(this, 'Cảnh báo', 'Vui lòng xác thực thông tin đầy đủ trước khi tiếp tục');
        } else { //xử lý template check
            if (!isLoading1 && imgFront) {
                Utils.goscreen(this, 'scResultCheck', { typeCheck: 2 });
                return;
            }
            Utils.showMsgBoxOK(this, 'Cảnh báo', 'Vui lòng nhập thông tin đầy đủ trước khi tiếp tục');
        }
    }

    onResponse1 = async (item) => {
        try {
            this.setState({ imgFront: item.uri, isLoading1: true });
            console.log('onResponse1xxxURI123:', item);
            let res = {};
            if (this.typeCheck == 1)
                res = await apiUploadFront(item);
            else
                res = await apiUploadTemplate(item);
            let tempURI = item.uri;
            let status1 = 'Valid'
            if (!res || res.error) {
                status1 = 'Invalid'
                tempURI = undefined;
                Utils.showMsgBoxOK(this, 'Hình ảnh không hợp lệ', 'Vui lòng chụp mặt trước CMND trong khung xanh');
            } else
                ROOTGlobal['dataTemplate'] = res.stt;
            this.setState({ imgFront: tempURI, isLoading1: false, status1 });
            console.log('onResponse1xxx:', res);
        } catch (error) {
            Utils.showMsgBoxOK(this, 'Hình ảnh không hợp lệ', 'Vui lòng chọn lại');
        }
    }

    onResponse2 = async (item) => {
        try {
            this.setState({ imgBack: item.uri, isLoading2: true });
            let res = await apiUploadBack(item);
            let tempURI = item.uri;
            let status2 = 'Valid'
            if (!res || res.error) {
                status2 = 'Invalid'
                tempURI = undefined;
                Utils.showMsgBoxOK(this, 'Hình ảnh không hợp lệ', 'Vui lòng chụp mặt sau CMND trong khung xanh')
            }
            this.setState({ imgBack: tempURI, isLoading2: false, status2 });
            console.log('onResponse2xxx:', res);
        } catch (error) {
            Utils.showMsgBoxOK(this, 'Hình ảnh không hợp lệ', 'Vui lòng chọn lại');
        }
    }

    onTakeCard = (isFront = true) => () => {
        if (this.typeCheck == 1)
            Utils.goscreen(this, 'Modal_TakeCameraCus1', { onResponse: isFront ? this.onResponse1 : this.onResponse2, showLeft: false, showRight: false });
        else {
            let options = {
                assetType: 'Photos',//All,Videos,Photos - default
                multi: false,// chọn 1 or nhiều item
                response: this.onResponse1, // callback giá trị trả về khi có chọn item
                limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
                groupTypes: 'All',
                showTakeCamera: false
            };
            Utils.goscreen(this, 'Modal_MediaPicker', options);
        }
    }

    render() {
        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainerX}>
                {/* Header  */}
                <HeaderCom
                    titleText={RootLang.lang.TakephotoofID}
                    nthis={this} />
                {/* BODY */}
                <ScrollView>
                    <View style={[nstyles.nbody, { paddingTop: 20 }]}>
                        <View style={[nstyles.nrow, { marginHorizontal: this.typeCheck == 2 ? Width(15) : 15 }]}>
                            {this.renderStatusBar(0, RootLang.lang.Step + ' 1')}
                            {this.renderStatusBar(1, RootLang.lang.Step + ' 2')}
                            {this.typeCheck == 2 ? null : this.renderStatusBar(2, RootLang.lang.Step + ' 3')}
                        </View>
                        <Text style={{ textAlign: 'center', marginHorizontal: '15%', marginVertical: '10%' }}>
                            {RootLang.lang.Pleasesend_photocopied}
                        </Text>
                        <View style={[nstyles.nrow, { marginHorizontal: 15, marginBottom: '8%' }]}>
                            {this.renderOption(0, RootLang.lang.IDCard)}
                            {this.renderOption(1, RootLang.lang.IDCard2)}
                            {this.renderOption(2, RootLang.lang.License)}
                        </View>
                        {/* Khung chon CMND */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 15 }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity onPress={this.onTakeCard()} style={[stCardCheck.imgContent, this.typeCheck == 2 ? { height: Width(61) } : {}]}>
                                    {
                                        this.state.imgFront ?
                                            <Image source={{ uri: this.state.imgFront }}
                                                style={{ width: '100%', height: '100%', borderRadius: 6 }} /> :
                                            <Image source={Images.icFront} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
                                    }
                                </TouchableOpacity>
                                <View style={[nstyles.nrow, { alignItems: 'center', marginTop: 10 }]}>
                                    {this.state.isLoading1 ? <ActivityIndicator color={colors.greenyBlue} /> : null}
                                    <Text style={{ fontWeight: 'bold', marginLeft: 5 }}>{RootLang.lang.Frontphoto}</Text>
                                </View>
                                <Text style={{ color: this.state.status1 == 'Invalid' ? 'red' : colors.colorGreen, fontWeight: '600', fontStyle: 'italic', marginTop: 5 }}>
                                    {this.state.status1}</Text>
                            </View>
                            {
                                this.typeCheck == 2 ? null :
                                    <>
                                        <View style={{ width: 10 }} />
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <TouchableOpacity onPress={this.onTakeCard(false)} style={stCardCheck.imgContent}>
                                                {
                                                    this.state.imgBack ?
                                                        <Image source={{ uri: this.state.imgBack }}
                                                            style={{ width: '100%', height: '100%', borderRadius: 6 }} /> :
                                                        <Image source={Images.icBack} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
                                                }
                                            </TouchableOpacity>
                                            <View style={[nstyles.nrow, { alignItems: 'center', marginTop: 10 }]}>
                                                {this.state.isLoading2 ? <ActivityIndicator color={colors.greenyBlue} /> : null}
                                                <Text style={{ fontWeight: 'bold', marginLeft: 5 }}>{RootLang.lang.Backphoto}</Text>
                                            </View>
                                            <Text style={{ color: this.state.status2 == 'Invalid' ? 'red' : colors.colorGreen, fontWeight: '600', fontStyle: 'italic', marginTop: 5 }}>
                                                {this.state.status2}</Text>
                                        </View>
                                    </>
                            }
                        </View>
                    </View>
                </ScrollView>
                {/* Nut gui */}
                <ButtonCom
                    onPress={this.onNext}
                    Linear={true}
                    sizeIcon={30}
                    style={{ marginHorizontal: '15%', marginTop: 10, marginBottom: 20 }}
                    text={this.typeCheck == 2 ? RootLang.lang.Verifyinformation : RootLang.lang.Next}
                />
            </View>
        );
    }
}

