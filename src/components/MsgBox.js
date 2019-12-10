import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert,
    TouchableOpacity, Modal, Animated, Easing
} from 'react-native';
import { nstyles, nwidth, nColors } from '../styles/styles'
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors } from '../styles/color';
import { sizes } from '../styles/size';

//styles màn hình popup
export const stMsgBox = StyleSheet.create({
    npopupContain: {
        position: 'absolute',
        left: 0, right: 0, bottom: 0, top: 0,
        flexDirection: 'column'
    },
    npopupBgr: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: colors.black,
        opacity: 0.28
    },
    ntext: {
        textAlign: 'center',
        fontSize: sizes.sText16,
        marginVertical: 5
    },
    btnContain: {
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 8,
        marginHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: colors.colorGrayText
    }
});

export default class MsgBox extends React.PureComponent {

    constructor(props) {
        super(props);
        this.igoscreen = this.props.igoscreen;
        this.title = this.props.navigation.getParam('title', '');
        this.message = this.props.navigation.getParam('message', null);
        this.buttons = this.props.navigation.getParam('buttons', [{ text: 'OK', onPress: () => { } }]);
        // --
        this.state = {
            isShowMsg: true,
            opacityView: new Animated.Value(0),
            widthView: new Animated.Value(0.15 * nwidth)
        }
    }

    componentDidMount() {
        const ani1 = Animated.timing(
            this.state.opacityView,
            {
                toValue: 0.96,
                duration: 300
            }
        );
        const ani2 = Animated.timing(
            this.state.widthView,
            {
                toValue: 0.88 * nwidth,
                duration: 500,
                easing: Easing.bounce
            }
        );
        Animated.parallel([ani1, ani2]).start();
    }

    static show(params) {
        this.setState({ isShowMsg: false });
    }

    onOK = () => {
        Utils.goback(this, null);
        this.buttons[0].onPress();
    }

    onCancel = () => {
        Utils.goback(this, null);
        this.buttons[1].onPress();
    }

    //Menu popup More...
    render() {
        return (
            <View style={[nstyles.ncontainerX, { backgroundColor: colors.nocolor }]}>
                <View style={[stMsgBox.npopupContain, { justifyContent: 'center', bottom: 0, alignItems: 'center' }]}>
                    <View style={stMsgBox.npopupBgr} />
                    <Animated.View style={{
                        backgroundColor: 'white', minHeight: 100, maxHeight: '70%', opacity: this.state.opacityView,
                        width: this.state.widthView, borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: 10, paddingVertical: 12
                    }}>
                        <Text style={[stMsgBox.ntext, { fontWeight: 'bold', fontSize: sizes.sText17, marginHorizontal: 5 }]}>{this.title}</Text>
                        {
                            this.message == null || this.message == '' ? null :
                                <Text style={[stMsgBox.ntext, { marginHorizontal: 5 }]}>{this.message}</Text>
                        }
                        <View style={[nstyles.nrow, { justifyContent: 'center', marginVertical: 8 }]}>
                            {
                                this.buttons.length == 2 ?
                                    <TouchableOpacity activeOpacity={0.8}
                                        onPress={this.onCancel}
                                        style={[stMsgBox.btnContain, { marginRight: 10, flex: 1 }]}>
                                        <Text style={[stMsgBox.ntext, { color: colors.white, fontWeight: '600', flex: 1 }]} numberOfLines={3}>
                                            {this.buttons[1].text}
                                        </Text>
                                    </TouchableOpacity> : null
                            }
                            <TouchableOpacity activeOpacity={0.8}
                                onPress={this.onOK}
                                style={[stMsgBox.btnContain, { backgroundColor: nColors.main },
                                this.buttons.length != 2 ? { minWidth: 120 } : { flex: 1 }]}>
                                <Text style={[stMsgBox.ntext, { color: colors.white, fontWeight: '600' }]} numberOfLines={3}>
                                    {this.buttons[0].text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </View>
        );
    }
}


