import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, FlatList, TouchableOpacity, ScrollView
} from 'react-native';

import { nstyles } from '../../styles/styles';
import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { Images } from '../../images';
import { sizes } from '../../styles/size';
import HeaderCom from '../../components/HeaderCom';
import { colors } from '../../styles';
import ButtonCom from '../../components/Button/ButtonCom';
import InputCus from '../../components/ComponentApps/InputCus';


const stSelectPerson = StyleSheet.create({
    contentInput: {
        marginHorizontal: '4%'
    }
});

export default class SelectPerson extends Component {
    constructor(props) {
        super(props);
        
        this.dataSearch = '';
        this.state = {
            //data globle
            isLoading: false,
            //-data local
            dataNV: [1, 2, 3, 4, 5, 6, 7, 1, 1, 1, 1, 1, 1],
            IdNV: -1,

        }
    }

    componentDidMount = async () => {

    }

    onLoadMore = () => {

    }

    onNext = () => {
        if (this.dataSearch.length == 0) {
            Utils.showMsgBoxOK(this, 'Cảnh báo', 'Vui lòng chọn nhân viên');
            return;
        }
        Utils.goscreen(this, 'scRegisFace', { emp_id: this.dataSearch });
    }

    onItemClick = (item, index) => () => {
        this.setState({ IdNV: index })
    }

    render() {
        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainerX}>
                {/* Header  */}
                <HeaderCom
                    iconLeft={null}
                    titleText={'Chọn nhân viên'}
                    nthis={this} />
                {/* BODY */}
                <View style={nstyles.nbody}>
                    <View style={{ flex: 1 }}>
                        <InputCus
                            placeholder={"Nhập họ tên hoặc mã nhân viên"}
                            onChangeText={text => (this.dataSearch = text)}
                            customStyle={stSelectPerson.contentInput}
                        />
                        <FlatList
                            data={this.state.dataNV}
                            style={{ marginTop: 10 }}
                            onEndReached={this.onLoadMore}
                            onEndReachedThreshold={0.3}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity style={{
                                    marginHorizontal: 15, marginBottom: 4, padding: 5, borderRadius: 5,
                                    borderColor: colors.greyLight, borderWidth: 1, paddingVertical: 8,
                                    backgroundColor: this.state.IdNV == index ? colors.colorGreen : colors.white
                                }}
                                    onPress={this.onItemClick(item, index)}>
                                    <Text>Họ tên: Mai Tiến Nhất</Text>
                                    <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
                                        <Text style={{ color: colors.colorGrayText, fontSize: 13 }}>Mã NV: DPS02</Text>
                                        <Text style={{ fontStyle: 'italic', color: colors.waterBlue, fontSize: 13 }}>Chưa đăng ký</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
                {/* Nut gui */}
                <ButtonCom
                    onPress={this.onNext}
                    Linear={true}
                    sizeIcon={30}
                    style={{ marginHorizontal: '15%', marginTop: 10, marginBottom: 20 }}
                    text={"TIẾP TỤC"}
                />
            </View>
        );
    }
}

