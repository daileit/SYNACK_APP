import React, { Component } from 'react';
import {
    StyleSheet, Text, TouchableOpacity, Platform, View, Image
} from 'react-native';
import { colors } from '../../styles/color';
import { sizes, reText } from '../../styles/size';
import { nColors, nstyles } from '../../styles/styles';
import LinearGradient from 'react-native-linear-gradient'
import { Images } from '../../images';

/*
    - style:
      + ...style Dùng cho contain button
      + color, fontSize, fontWeight dùng cho Text.
    - shadow (bool):
      + true: button có đổ bóng
      + false: button không có đổ bóng
*/

const ButtonCom = (props) => {

    let {
        icon = null,
        sizeIcon = 45,
        onPress,
        text = 'Button',
        shadow = true,
        disabled = false,
        Linear = false,
        txtStyle = {},
        style = {},
        styleTouchable = {},
        colorChange = true,
        subText = ''
    } = props;
    let { backgroundColor = colors.waterBlue } = style;
    let shadowStyle = {}
    if (shadow == true) {
        shadowStyle = stButtonCom.containShadow;
    }

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            disabled={disabled}
            style={{ ...styleTouchable }}
            onPress={onPress}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={Linear && colorChange == true ? [colors.greenFE, colors.greenyBlue] : colorChange != true ? colorChange : [backgroundColor, backgroundColor]}
                style={[stButtonCom.containerBtn, shadowStyle, style]}>
                <Text style={[nstyles.ntext, { color: colors.white, fontSize: reText(15), lineHeight: 19, fontWeight: '600' }, txtStyle]}>
                    {text}
                </Text>
                {subText == '' ? null : <Text style={{ fontSize: reText(10), marginTop: 4, color: colors.whiteTwo }}>{subText}</Text>}
                {
                    !icon ? null :
                        <View style={[{
                            position: 'absolute', top: 0, right: 0, bottom: 0, width: 50,
                            backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'
                        }]}>
                            <Image source={icon} style={{ width: sizeIcon, height: sizeIcon }} resizeMode='stretch' />
                        </View>
                }
            </LinearGradient>
        </TouchableOpacity>
    );
}
const stButtonCom = StyleSheet.create({
    containerBtn: {
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 24
    },
    containShadow: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 9,
        shadowOpacity: 1,
        elevation: Platform.OS == "android" ? 3 : 0
    }
});

export default ButtonCom;
