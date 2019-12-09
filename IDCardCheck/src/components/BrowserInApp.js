import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, StatusBar,
    Alert, TouchableOpacity, Dimensions,
    TextInput
} from 'react-native';

import { WebView } from 'react-native-webview'

import {
    nstyles, ActivityIndicator, nColors
} from '../styles/styles';
import { sizes } from '../styles/size';
import { Images } from '../images';
import Utils from '../app/Utils';

//Deep link Test
htmlTest = `
<html>
    <body>
        <a style="font-size: 50px;" href="tripu123123://app/root/drawer/hotels/confirm/2">Open Appp</a>
    </body>
</html>`;

export default class BrowserInApp extends Component {
    constructor(props) {
        super(props);
        link = this.props.navigation.getParam('link', '');
        istitle = this.props.navigation.getParam('istitle', false);
        isEditUrl = this.props.navigation.getParam('isEditUrl', true);
        title = this.props.navigation.getParam('title', '');
        isHtml = this.props.navigation.getParam('isHtml', false);
        if (isHtml) {
            isEditUrl = false;
            istitle = true;
        }
        this.state = {
            //data globle
            isLoading: false,
            editlink: link
        };
        StatusBar.setHidden(false);
    }

    onBack = () => {
        Utils.goback(this);
        //callback gọi lại để set status bar bên welcome
        let oncallBack = this.props.navigation.getParam('callback', null);
        if (oncallBack != null)
            oncallBack();
    }

    render() {
        return (
            <View style={nstyles.ncontainerX}>
                <View style={[nstyles.nhead, { backgroundColor: nColors.main2 }]}>
                    <View style={nstyles.nHcontent}>
                        <View style={nstyles.nHleft}>
                            <TouchableOpacity onPress={this.onBack} style={{ paddingLeft: 5 }}>
                                <Image source={Images.icbackspace} style={[nstyles.nIcon20]} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>
                        <View style={nstyles.nHmid}>
                            {
                                istitle ?
                                    <Text style={[nstyles.ntitle, { color: nColors.main }]}>{title}</Text> :
                                    <View style={{ backgroundColor: 'white', borderRadius: 25, paddingVertical: 3 }}>
                                        <TextInput editable={isEditUrl}
                                            placeholder={this.state.editlink}
                                            value={this.state.editlink}
                                            style={nstyles.ntextinput}
                                        />
                                    </View>
                            }
                        </View>
                        <View style={nstyles.nHright} />
                    </View>
                </View>
                <View style={nstyles.nbody}>
                    {
                        isHtml ?
                            <WebView
                                originWhitelist={['*']}
                                source={{ html: link }}
                            /> :
                            <WebView source={{ uri: link }}
                                startInLoadingState={true}
                            />
                    }
                </View>
            </View>
        );
    }
}

