import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/color';
import { nstyles, nColors } from '../styles/styles';
import Utils from '../app/Utils';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import ModalCheckPermission from './checkPermission';
import IsLoading from '../components/IsLoading'
import DatePick from '../components/DatePick'
import MultiSlider from './Silder/MultiSlider';


export default class AllComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalPermission: null,
            dateTemp: '1993/09/28',
            //slider
            sliderOneChanging: false,
            sliderOneValue: [5],
            multiSliderValue: [0, 100],
            //---
        };
    }


    UNSAFE_componentWillMount() {

    }

    xinquyen = (mang) => {
        let temp = <ModalCheckPermission arrRules={mang} />
        this.setState({ modalPermission: temp });
    }

    render() {
        const datatest = [
            {
                componentItem: <TouchableOpacity style={{
                    padding: 10, marginBottom: 10,
                    backgroundColor: nColors.main2
                }} onPress={() => Utils.showMsgBoxOK(this, 'Mật khẩu đăng nhập sai')}>
                    <Text style={{ color: colors.white }}>Msg Box</Text>
                </TouchableOpacity>
            },

            {
                componentItem: <TouchableOpacity style={{
                    padding: 10, marginBottom: 10,
                    backgroundColor: nColors.main2
                }} onPress={() => this.xinquyen([1, 2, 3, 4])}>
                    <Text style={{ color: colors.white }}>Check Pemission</Text>
                    {
                        this.state.modalPermission
                    }
                </TouchableOpacity>
            },

            {
                componentItem: <TouchableOpacity style={{
                    padding: 10, marginBottom: 10,
                    backgroundColor: nColors.main2
                }} onPress={() => Utils.goscreen(this, 'sc_MapsMaker')}>
                    <Text style={{ color: colors.white }}>Maps Maker</Text>
                </TouchableOpacity>
            },
            {
                componentItem: <TouchableOpacity style={{
                    padding: 10, marginBottom: 10,
                    backgroundColor: nColors.main2
                }} onPress={() => Utils.goscreen(this, 'sc_MapsDirection')}>
                    <Text style={{ color: colors.white }}>Maps Direction</Text>
                </TouchableOpacity>
            },
            {
                componentItem: <TouchableOpacity style={{
                    padding: 10, marginBottom: 10,
                    backgroundColor: nColors.main2
                }} onPress={() => this.nLoading.show()}>
                    <Text style={{ color: colors.white }}>Loading</Text>
                </TouchableOpacity>
            },
            {
                componentItem: <View style={{
                    flexDirection: 'row',
                    padding: 10, marginBottom: 10,
                    backgroundColor: nColors.main2
                }}>
                    <Text style={{ color: colors.white }}>Lịch</Text>

                    <DatePick value={this.state.dateTemp}
                        onValueChange={(val) => this.setState({ dateTemp: val })}
                    />
                    <DatePick value={this.state.dateTemp2}
                        style={{ backgroundColor: 'red', width: 150, height: 40, color: 'white', fontSize: 20, fontWeight: '600' }}
                        activeOpacity={0.9}
                        onValueChange={(val) => this.setState({ dateTemp2: val })}
                        format='DD/MM/YYYY'
                    />
                </View>
            },
            {
                componentItem: <View style={{
                    padding: 10, marginBottom: 10,
                    backgroundColor: nColors.main2
                }}>
                    <Text style={{ color: colors.white }}>Slider:</Text>
                    <MultiSlider
                        values={[
                            this.state.multiSliderValue[0],
                            this.state.multiSliderValue[1],
                        ]}
                        sliderLength={280}
                        onValuesChange={this.multiSliderValuesChange}
                        min={0}
                        max={100}
                        step={1}
                        allowOverlap
                        snapped
                    />
                </View>
            }
        ];
        return (
            <View style={nstyles.ncontainer}>
                <ScrollView>
                    <View style={{
                        backgroundColor: colors.colorGrayBgr, flex: 1,
                        justifyContent: 'center', alignItems: 'center', marginTop: 80
                    }}>
                        {
                            datatest.map((item, index) =>
                                <View key={index}>
                                    {
                                        item.componentItem
                                    }
                                </View>
                            )
                        }
                    </View>
                </ScrollView>
                <IsLoading ref={(ref) => {
                    this.nLoading = ref
                }} />

            </View>
        );
    }
}
