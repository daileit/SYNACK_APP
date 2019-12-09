import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert, TouchableOpacity, ScrollView
} from 'react-native';

import { nstyles, Width } from '../../styles/styles';
import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { Images } from '../../images';
import HeaderCom from '../../components/HeaderCom';
import { colors } from '../../styles';
import ButtonCom from '../../components/Button/ButtonCom';
import { reText } from '../../styles/size';
import { RootLang } from '../../app/data/locales';
import { apiGetKQORC, apiGetKQFace, apiGetKQTemplate, apiGetKQFinger } from '../../apis/apiCMND';
import { appConfig } from '../../app/Config';
import { ROOTGlobal } from '../../app/data/dataGlobal';


const stResultCheck = StyleSheet.create({
    imgContent: {
        width: '100%', height: 100, alignItems: 'center', justifyContent: 'center',
        borderColor: colors.colorGrayIcon, borderWidth: 1, borderRadius: 6
    },
    bgrTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: colors.colorPowderBlue,
    },
    contentKhungKQ: {
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: colors.colorGrayIcon,
        margin: 10
    },
    textTitle: {
        fontWeight: 'bold'
    },
    textPer: {
        color: 'green',
        fontWeight: 'bold'
    },
    imgStyle: {
        width: '48%',
        height: 200
    },
    textContainDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        paddingVertical: 6
    },
    textInfoCard: {
        fontSize: reText(15),
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
        marginLeft: 20
    }
});

export default class ResultCheck extends Component {
    constructor(props) {
        super(props);
        this.statusStep = 2;
        this.typeCheck = Utils.ngetParam(this, 'typeCheck', 1); //1: check CMND chuẩn, 2: check template CMND
        this.state = {
            //data globle
            isLoading: false,
            //-data local
            indexFocus: this.typeCheck == 2 ? 3 : 0,
            imgTemplate: appConfig.domain88 + 'app_template_result',
            imgFaceResult: appConfig.domain88 + 'app_face_result',
            dataORC: {},


        }
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

    componentDidMount = async () => {
        if (this.typeCheck == 1) {
            this.onLoadOCR();
            // this.onLoadFace();
            // this.onLoadFinger();
        } else {
            // this.onLoadTemplate();
        }

    }

    onLoadOCR = async () => {
        let res = await apiGetKQORC();
        this.setState({ dataORC: res });
        console.log('apiGetKQORC', res);
    }
    onLoadFace = async () => {
        let res = await apiGetKQFace();
        console.log('apiGetKQFace', res);
    }
    onLoadTemplate = async () => {
        // let res = await apiGetKQTemplate();
        // this.setState({ imgTemplate: res });
        // console.log('apiGetKQTemplate', res);
    }
    onLoadFinger = async () => {
        // let res = await apiGetKQFinger();
        // console.log('apiGetKQFinger', res);
    }

    onShowKQ = (index) => () => {
        this.setState({ indexFocus: index == this.state.indexFocus ? -1 : index });
    }

    onDone = () => {
        Utils.goscreen(this, 'scHome');
    }

    render() {
        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainerX}>
                {/* Header  */}
                <HeaderCom
                    titleText={RootLang.lang.Confirm}
                    nthis={this} />
                {/* BODY */}
                <ScrollView>
                    <View style={[nstyles.nbody, { paddingTop: 20 }]}>
                        <View style={[nstyles.nrow, { marginHorizontal: this.typeCheck == 2 ? Width(15) : 15 }]}>
                            {this.renderStatusBar(0, RootLang.lang.Step + ' 1')}
                            {this.renderStatusBar(1, RootLang.lang.Step + ' 2')}
                            {this.typeCheck == 2 ? null : this.renderStatusBar(2, RootLang.lang.Step + ' 3')}
                        </View>
                        <Text style={{ textAlign: 'center', marginHorizontal: '15%', marginVertical: '5%' }}>
                            {RootLang.lang.The_results}
                        </Text>

                        {
                            this.typeCheck == 1 ?
                                <>

                                    {/* Thong tin Ket qua OCR */}
                                    <View style={stResultCheck.contentKhungKQ}>
                                        <TouchableOpacity activeOpacity={0.8} onPress={this.onShowKQ(0)} style={stResultCheck.bgrTitle}>
                                            <Text style={stResultCheck.textTitle}>{RootLang.lang.ocrresults}</Text>
                                            <Text style={stResultCheck.textPer}>--</Text>
                                        </TouchableOpacity>
                                        {
                                            this.state.indexFocus != 0 ? null :
                                                <>
                                                    <View style={stResultCheck.textContainDetail}>
                                                        <Text>{RootLang.lang.IDnumber}</Text>
                                                        <Text style={stResultCheck.textInfoCard}>{this.state.dataORC.idn}</Text>
                                                    </View>
                                                    <View style={stResultCheck.textContainDetail}>
                                                        <Text>{RootLang.lang.Fullname}</Text>
                                                        <Text style={stResultCheck.textInfoCard}>{this.state.dataORC.name}</Text>
                                                    </View>
                                                    <View style={stResultCheck.textContainDetail}>
                                                        <Text>{RootLang.lang.Birthday}</Text>
                                                        <Text style={stResultCheck.textInfoCard}>{this.state.dataORC.birth}</Text>
                                                    </View>
                                                    <View style={stResultCheck.textContainDetail}>
                                                        <Text>{RootLang.lang.Placeofbirth}</Text>
                                                        <Text style={stResultCheck.textInfoCard}>{this.state.dataORC.hometown}</Text>
                                                    </View>
                                                    <View style={stResultCheck.textContainDetail}>
                                                        <Text>{RootLang.lang.Placeof_residence}</Text>
                                                        <Text style={stResultCheck.textInfoCard}>{this.state.dataORC.place}</Text>
                                                    </View>
                                                </>
                                        }
                                    </View>

                                    {/* Thong tin Ket qua Face */}
                                    <View style={stResultCheck.contentKhungKQ}>
                                        <TouchableOpacity activeOpacity={0.8} onPress={this.onShowKQ(1)} style={stResultCheck.bgrTitle}>
                                            <Text style={stResultCheck.textTitle}>{RootLang.lang.facedetect}</Text>
                                            <Text style={stResultCheck.textPer}>{ROOTGlobal['facedata']}%</Text>
                                        </TouchableOpacity>
                                        {
                                            this.state.indexFocus != 1 ? null :
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                                    <Image source={{uri: this.state.imgFaceResult}} style={stResultCheck.imgStyle} resizeMode='contain' />
                                                    <Image source={{ uri: ROOTGlobal['faceUri'] }} style={stResultCheck.imgStyle} resizeMode='contain' />
                                                </View>
                                        }
                                    </View>

                                    {/* Thong tin Ket qua Finger */}
                                    <View style={stResultCheck.contentKhungKQ}>
                                        <TouchableOpacity activeOpacity={0.8} onPress={this.onShowKQ(2)} style={stResultCheck.bgrTitle}>
                                            <Text style={stResultCheck.textTitle}>{RootLang.lang.Fingerprint_result}</Text>
                                            <Text style={stResultCheck.textPer}>--</Text>
                                        </TouchableOpacity>
                                        {
                                            this.state.indexFocus != 2 ? null :
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                                    <Image source={require('../../images/imgApp/CMNDTest.jpg')} style={stResultCheck.imgStyle} resizeMode='contain' />
                                                    <Image source={require('../../images/imgApp/CMNDTest.jpg')} style={stResultCheck.imgStyle} resizeMode='contain' />
                                                </View>
                                        }
                                    </View>
                                </> :

                                <View style={stResultCheck.contentKhungKQ}>
                                    {/* Thong tin Ket qua Template */}
                                    <TouchableOpacity activeOpacity={0.8} onPress={this.onShowKQ(3)} style={stResultCheck.bgrTitle}>
                                        <Text style={stResultCheck.textTitle}>{RootLang.lang.Templatecheck}</Text>
                                        <Text style={stResultCheck.textPer}>--</Text>
                                    </TouchableOpacity>
                                    <Text style={[stResultCheck.textPer, { textAlign: 'center', margin: 4, marginHorizontal: 8 }]}>{ROOTGlobal['dataTemplate']}</Text>
                                    {
                                        this.state.indexFocus != 3 ? null :
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                                <Image source={{ uri: this.state.imgTemplate }} style={[stResultCheck.imgStyle, { width: '100%', height: 230 }]} resizeMode='contain' />
                                            </View>
                                    }
                                </View>
                        }
                    </View>
                </ScrollView>
                {/* Nut gui */}
                <ButtonCom
                    onPress={this.onDone}
                    Linear={true}
                    sizeIcon={30}
                    style={{ marginHorizontal: '15%', marginTop: 10, marginBottom: 20 }}
                    text={RootLang.lang.Done}
                />

            </View >
        );
    }
}

