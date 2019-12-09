import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert, TouchableOpacity
} from 'react-native';
import { nstyles, nColors, heightHed, paddingTopMul } from '../styles/styles'
import Utils from '../app/Utils';
import { Images } from '../images';
import { sizes, colors } from '../styles';
import LinearGradient from 'react-native-linear-gradient';


export default class HeaderCom extends Component {
    constructor(props) {
        super(props);
        var {
            iconLeft = Images.icBackLeft,
        } = props;

        let TempiconLeft = iconLeft;
        // this.typeLeft = TempiconLeft == Images.icBackLeft; // is menu or back
        this.iconLeft = TempiconLeft;
        this.nthis = props.nthis == undefined ? nthis : props.nthis;
    }

    _onPressLeftDefault = () => {
        try {
            Utils.goback(this.nthis, null);
        } catch (error) {
        }
    }

    _onPressRightDefault = () => {
        try {
            Utils.goscreen(this.nthis, 'sc_NotificationTripU');
        } catch (error) {

        }

    }

    render() {
        let { iconRight } = this.props;
        // const { onPressLeft = this._onPressLeftDefault, onPressRight = this._onPressRightDefault,
        //     titleText = '', style = {}, tintColorLeft = nColors.main2, orange = false, notification, customStyleIconRight = {} } = this.props;
        let {
            onPressLeft = this._onPressLeftDefault,
            titleText = 'Title',
            style = {},
            componentLeft = null,
            isTransparent = false,
            tintColorLeft = colors.white,
            notification,
            height = heightHed - paddingTopMul,
            titleTextCustoms = undefined,
            customStyleIconRight = {},
            onPressRight = this._onPressRightDefault,
            hiddenIconRight = false
        } = this.props;
        height += paddingTopMul;
        //---
        const { color = nColors.main2,
            // colors = (titleText != '' ? nColors.main2 : nColors.main),
            borderBottomWidth = (titleText != '' ? 0 : 1) } = style;
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={isTransparent ? [colors.nocolor, colors.nocolor] : [colors.greenFE, colors.greenyBlue]}
                style={[nstyles.nhead, { ...style, borderBottomWidth, height: height }, isTransparent ? { backgroundColor: colors.nocolor } : {}]}>
                <View style={nstyles.nHcontent}>
                    <View style={[nstyles.nHleft, { marginBottom: height - heightHed }]}>
                        {
                            componentLeft ? componentLeft :
                                (
                                    this.iconLeft != null ?
                                        <TouchableOpacity
                                            style={{ paddingLeft: 5 }}
                                            onPress={onPressLeft}>
                                            <Image
                                                source={this.iconLeft}
                                                resizeMode='contain'
                                                style={[nstyles.nIcon20, { tintColor: tintColorLeft }]} />
                                        </TouchableOpacity> : null
                                )
                        }
                    </View>
                    {
                        titleTextCustoms ? titleTextCustoms :
                            <View style={[nstyles.nHmid]}>
                                {
                                    titleText ? <Text numberOfLines={1} style={[nstyles.ntitle, { color }]}>
                                        {titleText}
                                    </Text> : null
                                }
                            </View>
                    }
                    <View style={[nstyles.nHright, { marginBottom: height - heightHed }]}>
                        {
                            iconRight == Images.icRefresh ?
                                <TouchableOpacity
                                    onPress={onPressRight}
                                >
                                    <Image source={iconRight}
                                        resizeMode='contain'
                                        style={[nstyles.nIcon24, customStyleIconRight]}
                                    />
                                </TouchableOpacity>
                                :
                                !hiddenIconRight ? //ẩn icon right
                                    <TouchableOpacity
                                        onPress={onPressRight}
                                        style={{ marginRight: 8 }}
                                    >
                                        <Image source={iconRight}
                                            resizeMode='contain'
                                            style={[nstyles.nIcon24, customStyleIconRight]}
                                        />
                                        {
                                            notification != undefined ? <LinearGradient
                                                colors={[colors.blue, colors.waterBlue]}
                                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                                style={[nstyles.nmiddle, {
                                                    backgroundColor: colors.blue,
                                                    position: 'absolute',
                                                    height: 18, width: 18,
                                                    marginLeft: 15,
                                                    borderRadius: 9,
                                                    marginTop: -5
                                                }]}>
                                                <Text style={{ color: 'white', fontSize: sizes.sizes.sText10, fontWeight: '800' }}>{notification}</Text>
                                            </LinearGradient> : null
                                        }
                                    </TouchableOpacity> : null
                        }
                    </View>
                </View>
            </LinearGradient>
        );
    }
}




