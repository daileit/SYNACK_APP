import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert, TouchableOpacity, ImageBackground
} from 'react-native';

import { nstyles } from '../../styles/styles';
import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { Images } from '../../images';
import { sizes } from '../../styles/size';
import HeaderCom from '../../components/HeaderCom';
import { Countrys } from '../../images/indexCountry';
import { colors } from '../../styles';
import { RootLang } from '../../app/data/locales';
import { apiConnect } from '../../apis/apiCMND';
import { ROOTGlobal } from '../../app/data/dataGlobal';


const stHome = StyleSheet.create({

});

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //data globle
            isLoading: false,
            //-data local

        }
    }

    componentDidMount = async () => {
        Utils.nlog('DataUser:', ROOTGlobal.dataUser);
        let tokenSession = await apiConnect();
        if (tokenSession.ssid) {
            ROOTGlobal.loginToken = tokenSession.ssid;
        }
        else {
            Utils.showMsgBoxOK(this, 'Cảnh báo', 'Kết nối server thất bại')
        }
    }

    onUserClick = () => {
        Utils.goscreen(this, 'Modal_User');
    }

    onMenuClick = (screen = '', param = {}) => () => {
        Utils.goscreen(this, screen, param);
    }

    renderItemMenu = (icon, text, onPress = () => { }) => {
        return (
            <TouchableOpacity style={[nstyles.shadow, {
                backgroundColor: colors.blueTwo, width: '45%', margin: 5, borderRadius: 6,
                alignItems: 'center', justifyContent: 'center', height: 110
            }]} onPress={onPress}>
                <Image style={[nstyles.nIcon50, { tintColor: colors.white }]} source={icon} />
                <Text style={{ color: colors.white, fontWeight: '600', marginTop: 15 }}>{text}</Text>
            </TouchableOpacity>
        )
    }

    onChangeLang = () => {
        Utils.goscreen(this, 'Modal_Language');
    }

    render() {
        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainer}>
                {/* Header  */}
                <HeaderCom
                    titleText={RootLang.lang.Home}
                    componentLeft={
                        <TouchableOpacity onPress={this.onUserClick}>
                            {
                                ROOTGlobal.dataUser.picture ? <Image source={{ uri: ROOTGlobal.dataUser.picture.data.url }} style={nstyles.nAva35} /> : null
                            }
                        </TouchableOpacity>
                    }
                    iconRight={Countrys[RootLang._keys]}
                    onPressRight={this.onChangeLang}
                    nthis={this} />

                {/* BODY */}
                <ImageBackground source={Images.icBrgHome} style={[nstyles.nbody]}>
                    <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 20, justifyContent: 'space-around' }}>
                        {this.renderItemMenu(Images.icCardCheck, RootLang.lang.IDCardCheck, this.onMenuClick('scCardCheck'))}
                        {this.renderItemMenu(Images.icCardCheck, RootLang.lang.Templatecheck, this.onMenuClick('scCardCheck', { typeCheck: 2 }))}
                        {/* {this.renderItemMenu(Images.icHistory, 'Lịch sử')} */}
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 20, justifyContent: 'space-around' }}>
                        {this.renderItemMenu(Images.icInfo, RootLang.lang.Infomation, this.onMenuClick('scInfoApp'))}
                        {this.renderItemMenu(Images.icSettings, RootLang.lang.Settings, this.onMenuClick('scSettings'))}
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    language: state.language
});

export default Utils.connectRedux(Home, mapStateToProps);

