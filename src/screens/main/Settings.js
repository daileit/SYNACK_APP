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
import { RootLang } from '../../app/data/locales';


const stInfoApp = StyleSheet.create({
    imgContent: {
        width: '100%', alignItems: 'center', justifyContent: 'center',
        borderColor: colors.colorGrayIcon, borderWidth: 1, borderRadius: 6
    }
});

export default class Settings extends Component {
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
                    titleText={RootLang.lang.Settings}
                    nthis={this} />
                {/* BODY */}
                <View style={nstyles.nbody}>
                    <View style={[nstyles.nrow]}>
                        {/* <Text>Mode:</Text>
                        <Text>DEBUG</Text>
                        <Text>RELEASE</Text> */}
                    </View>
                </View>
            </View>
        );
    }
}

