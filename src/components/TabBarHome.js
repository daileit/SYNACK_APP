import React, { Component } from 'react';

import { Keyboard, View, StyleSheet, Image, TouchableOpacity, Text, ImageBackground, Platform } from 'react-native';
import { nstyles, sTextNor, sText10, nwidth, heightBot, } from '../styles/styles'
import Utils from '../app/Utils';
import { colors } from '../styles/color';
import { sizes, isPad } from '../styles/size';
import { Images } from '../images';
import { RootLang } from '../app/data/locales';

/**
 * Define all images for this class
 * @type {*|Config|{panHandlers, getInteractionHandle}|{type, property}}
 */

const stTab = StyleSheet.create({
    btnTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 26,
        marginBottom: 2
    },
    textTab: {
        marginTop: 2,
        fontSize: sizes.sText10,
        color: colors.colorGrayIcon
    },
    textTabActive: {
        color: colors.orangeThree,
        fontWeight: '600'
    },
    iconActive: {
        tintColor: colors.orangeThree
    },
    iconTab: {
        tintColor: colors.colorGrayIcon
    }

});

class TabBarHome extends Component {
    constructor(props) {
        super(props);
    }

    tabClick = (screen, index) => () => {
        Keyboard.dismiss();
        Utils.goscreen(this, screen);
    }

    render() {
        const { index } = this.props.navigation.state;
        let tempIndex = index;
        if (index == 0 || index > 4)
            tempIndex = 0;
        return (
            <View style={[nstyles.nfooter, {
                width: '100%', justifyContent: 'center', alignItems: 'center', height: heightBot - (Platform.OS == 'ios' ? 10 : 2),
                backgroundColor: colors.white
            }]}>
                <ImageBackground
                    style={{
                        flexDirection: 'row', height: isPad ? 110 : 80, width: (isPad ? (nwidth + 40) : (nwidth + 30)),
                        marginLeft: -2, marginTop: -26, paddingLeft: isPad ? 23 : 17, paddingRight: isPad ? 18 : 13
                    }}
                    resizeMode='stretch'
                    source={Images.icTabBar}>
                    <TouchableOpacity onPress={this.tabClick('tab_MyHome', 0)} style={stTab.btnTab}>
                        <Image style={[nstyles.nIcon26, tempIndex === 0 ? stTab.iconActive : stTab.iconTab]} source={Images.icHome} resizeMode={'contain'} />
                        <Text style={[stTab.textTab, tempIndex === 0 ? stTab.textTabActive : {}]} numberOfLines={1}>Tab 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.tabClick('tab_MyWallet', 1)} style={stTab.btnTab}>
                        <Image style={[nstyles.nIcon26, tempIndex === 1 ? stTab.iconActive : stTab.iconTab]} source={Images.icViDienTu} resizeMode={'contain'} />
                        <Text style={[stTab.textTab, tempIndex === 1 ? stTab.textTabActive : {}]} numberOfLines={1}>Tab 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.tabClick('tab_MyTrip', 2)} style={[stTab.btnTab, { flex: 1.3, marginTop: isPad ? 17 : 21 }]}>
                        <Image style={[isPad ? nstyles.nIcon35 : nstyles.nIcon32, tempIndex === 2 ? {} : stTab.iconTab]} source={Images.icTripUHome} resizeMode={'contain'} />
                        <Text style={[stTab.textTab, tempIndex === 2 ? stTab.textTabActive : {}]} numberOfLines={1}>Tab 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.tabClick('tab_Message', 3)} style={stTab.btnTab}>
                        <Image style={[nstyles.nIcon26, tempIndex === 3 ? stTab.iconActive : stTab.iconTab]} source={Images.icTinNhan} resizeMode={'contain'} />
                        <Text style={[stTab.textTab, tempIndex === 3 ? stTab.textTabActive : {}]} numberOfLines={1}>Tab 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.tabClick('tab_MyUser', 4)} style={stTab.btnTab}>
                        <Image style={[nstyles.nIcon26, tempIndex === 4 ? stTab.iconActive : stTab.iconTab]} source={Images.icCuaToi} resizeMode={'contain'} />
                        <Text style={[stTab.textTab, tempIndex === 4 ? stTab.textTabActive : {}]} numberOfLines={1}>Tab 1</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    language: state.language
});

export default Utils.connectRedux(TabBarHome, mapStateToProps)