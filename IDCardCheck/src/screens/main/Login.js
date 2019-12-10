import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform,
    TouchableOpacity, ScrollView, ImageBackground
} from 'react-native';

import { nstyles } from '../../styles/styles';
import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { Images } from '../../images';
import { sizes } from '../../styles/size';
import InputCus from '../../components/ComponentApps/InputCus';
import ButtonCom from '../../components/Button/ButtonCom';
import { colors } from '../../styles';
import { RootLang } from '../../app/data/locales';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Input from "../../components/ComponentApps/Input";

import {
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
} from 'react-native-fbsdk';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { nkey } from '../../app/keys/keyStore';


const stLogin = StyleSheet.create({
    contentInput: {
        marginHorizontal: '10%'
    }
});

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //data globle
            isLoading: false,
            //-data local


        }
    }

    //----------------
    async facebookLogin() {
        // native_only config will fail in the case that the user has
        // not installed in his device the Facebook app. In this case we
        // need to go for webview.
        let result;
        try {
            // this.setState({ showLoadingModal: true });
            let typeLogin = Platform.OS == 'ios' ? 'browser' : 'native_with_fallback';
            LoginManager.setLoginBehavior(typeLogin);
            result = await LoginManager.logInWithPermissions(['email']);
        } catch (nativeError) {
            Utils.nlog('facebookLogin', nativeError);
            try {
                let typeLogin = Platform.OS == 'ios' ? 'browser' : 'web_only';
                LoginManager.setLoginBehavior(typeLogin);
                result = await LoginManager.logInWithPermissions(['email']);
            } catch (webError) {
                // show error message to the user if none of the FB screens
                // did not open
            }
        }
        // handle the case that users clicks cancel button in Login view
        // Utils.nlog('result ', result);
        if (result == undefined || result.isCancelled) {
            Utils.nlog('Login error');
        } else {
            // Create a graph request asking for user information
            this.FBGraphRequest('id, email, picture.type(large), name', this.FBLoginCallback);
        };
    }


    async FBGraphRequest(fields, callback) {
        const accessData = await AccessToken.getCurrentAccessToken();
        // Create a graph request asking for user information
        accessToken = accessData.accessToken;
        const infoRequest = new GraphRequest('/me', {
            accessToken: accessData.accessToken,
            parameters: {
                fields: {
                    string: fields
                }
            }
        }, callback.bind(this));
        // Execute the graph request created above
        new GraphRequestManager().addRequest(infoRequest).start();
    }

    async FBLoginCallback(error, result) {
        // var arr = result.name.split(' ');
        // var url = result.picture.data.url;
        // var id = result.id;
        // var email = result.email;
        ROOTGlobal.dataUser = result;
        if (result && result.id) {
            Utils.nsetStore(nkey.dataUser, result);
            Utils.goscreen(this, 'sw_Main');
        }
        Utils.nlog('check Idsa', result);
    }

    //----------------

    componentDidMount = async () => {
    }

    onLogin = () => {
        Utils.showMsgBoxOK(this, RootLang.lang.Commingsoon);
    }

    onLoginFB = (optionsCus = {}) => {
        this.facebookLogin();
    }

    render() {
        return (
            <ImageBackground source={Images.icBgr} style={[nstyles.ncontainer,
            { justifyContent: 'center', paddingBottom: 20 }]}>
                {/* <View style={{ position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' }}>
                    <Image source={Images.icTopLogin}
                        style={{ height: 110, width: '54%', alignSelf: 'center', marginLeft: 5, marginTop: -5 }}
                        resizeMode='stretch' />
                </View> */}
                <Image source={Images.iconApp}
                    style={{ width: 150, height: 150, alignSelf: 'center', marginBottom: 10, borderRadius: 10 }}
                    resizeMode='contain' />
                <Image source={Images.icTextLogin}
                    style={{ width: 200, height: 50, alignSelf: 'center', marginBottom: 30, borderRadius: 10 }}
                    resizeMode='contain' />
                <InputCus
                    placeholder={RootLang.lang.Enteryourusername}
                    onChangeText={text => (this.password = text)}
                    customStyle={stLogin.contentInput}
                />
                <InputCus
                    secureTextEntry={true}
                    placeholder={RootLang.lang.Enterpassword}
                    onChangeText={text => (this.password = text)}
                    customStyle={stLogin.contentInput}
                />
                <ButtonCom
                    onPress={this.onLogin}
                    Linear={true}
                    icon={Images.icFE}
                    sizeIcon={30}
                    style={[stLogin.contentInput, { marginTop: 10 }]}
                    text={RootLang.lang.Login.toUpperCase()}
                />
                    <ButtonCom
                        onPress={this.onLoginFB}
                        Linear={true}
                        icon={Images.icFB}
                        colorChange={[colors.blue, colors.waterBlue]}
                        style={[stLogin.contentInput, { marginTop: 10}]}
                        text={RootLang.lang.Loginwithfacebook.toUpperCase()}
                    />
                <View style={{height: '20%'}}/>
            </ImageBackground>
        );
    }
}

