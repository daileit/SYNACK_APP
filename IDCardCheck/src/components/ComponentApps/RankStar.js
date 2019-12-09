
import React, { Component } from 'react';
import {
    Image, View
} from 'react-native';
import { colors } from '../../styles/color';
import { sizes } from '../../styles/size';
import { nColors, nstyles } from '../../styles/styles';
import { Images } from '../../images';
import Utils from '../../app/Utils';

const RankStar = (props) => {
    let limitArray = [];
    //starMode : yellow, white
    let flag = false;
    let { style, starMode = 'yellow', marginLeftItem = 5, value = 0, limit = 5, sizeStart = 16, color = undefined } = props;
    value = parseFloat(value.toString());
    if (!isNaN(value)) {
        if (value % parseInt(value) != 0) {
            flag = true;
            value = Math.ceil(value)
        };
        if (style == undefined)
            style = {};
        if (starMode == 'yellow')
            limit = value;
        // let limitArray = [];
        while (limitArray.length != limit) {
            limitArray.push(limitArray.length + 1);
        }
    }
    else value = -1;

    return (
        value == -1 ? null :
            <View style={[nstyles.nrow, {
                height: sizeStart + 2, alignItems: 'center', ...style
            }]}>
                {
                    limitArray.map((item, index) => starMode == 'white' ?
                        <Image key={index.toString()}
                            source={item < value && flag ? Images.icStarWhite : item == value && flag ? Images.icMoon : item == value && !flag ? Images.icStarWhite : Images.icStarWhiteEmpty}
                            style={{ width: sizeStart, height: sizeStart, marginLeft: item == 1 ? 0 : marginLeftItem, tintColor: color }}
                            resizeMode='contain' /> :
                        <Image key={item.toString()} source={Images.icStarYellow}
                            style={{ width: sizeStart, height: sizeStart, marginLeft: item == 1 ? 0 : marginLeftItem, tintColor: color }}
                            resizeMode="contain" />
                    )
                }
            </View>

    );
}

export default RankStar;
