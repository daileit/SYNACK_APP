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
import { ROOTGlobal } from '../../app/data/dataGlobal';
import ButtonCom from '../../components/Button/ButtonCom';

import {
    LoginManager
} from 'react-native-fbsdk';
import { nkey } from '../../app/keys/keyStore';
import { reText } from '../../styles/size';



const stUser = StyleSheet.create({
    imgContent: {
        width: '100%', alignItems: 'center', justifyContent: 'center',
        borderColor: colors.colorGrayIcon, borderWidth: 1, borderRadius: 6
    },
    contentInput: {
        marginHorizontal: '10%'
    }
});

export default class User extends Component {
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
        Utils.nlog('DataUser:', ROOTGlobal.dataUser);
    }

    onLogout = () => {
        try {
            LoginManager.logOut();
            Utils.nsetStore(nkey.dataUser, null);
            Utils.goscreen(this, 'sw_Login');
        } catch (error) {

        }
    }

    render() {

        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainerX}>
                {/* Header  */}
                <HeaderCom
                    titleText={'User info'}
                    nthis={this} />
                {/* BODY */}
                <View style={nstyles.nbody}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 30, paddingHorizontal: 30 }}>
                        <Image source={{ uri: ROOTGlobal.dataUser.picture.data.url }} style={nstyles.nAva120} resizeMode='cover' />
                        <View style={[nstyles.nrow, { justifyContent: 'space-between', width: '100%', marginTop: 30 }]}>
                            <Text style={{ fontSize: reText(15), color: colors.colorGrayIcon }}>Name:</Text>
                            <Text style={{ fontSize: reText(15), fontWeight: '600' }}>{ROOTGlobal.dataUser.name}</Text>
                        </View>
                        <View style={[nstyles.nrow, { justifyContent: 'space-between', width: '100%', marginBottom: 50, marginTop: 10 }]}>
                            <Text style={{ fontSize: reText(15), color: colors.colorGrayIcon }}>Email:</Text>
                            <Text style={{ fontSize: reText(15), fontWeight: '600' }}>{ROOTGlobal.dataUser.email}</Text>
                        </View>
                    </View>

                    <ButtonCom
                        onPress={this.onLogout}
                        Linear={true}
                        colorChange={[colors.colorGrayIcon, colors.colorGrayIcon]}
                        style={[stUser.contentInput, { marginTop: 10 }]}
                        text={'Logout'}
                    />
                </View>
            </View>
        );
    }
}

