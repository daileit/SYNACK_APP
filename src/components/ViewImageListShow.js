import React, { Component } from 'react';
import { View, Image, FlatList, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { nstyles, sizes, Width } from '../styles';
import { Images } from '../images'
import Utils from '../app/Utils';
import ImageViewer from 'react-native-image-zoom-viewer';
import HeaderCom from '../components/HeaderCom';
import { RootLang } from '../app/data/locales';
import { paddingBotX } from '../styles/styles';
export default class ViewImageListShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }
        this.ListImages = Utils.ngetParam(this, 'ListImages', [])
        this.titleText = Utils.ngetParam(this, 'titleText', 'Xem thêm ảnh');
    }

    _selectImage = (index) => () => {
        this.setState({ index })
    }

    _renderItemImage = ({ item, index }) => {
        return <TouchableOpacity
            style={{ zIndex: 1 }}
            onPress={this._selectImage(index)}
        >
            <Image
                defaultSource={Images.icPhotoBlack}
                source={{ uri: item.url }} style={{ height: sizes.sizes.nImgSize80, width: sizes.sizes.nImgSize80, marginRight: 2 }} resizeMode='cover'
            />
        </TouchableOpacity>
    }

    _renderFooter = () => {
        return <View style={{ width: nstyles.Width(100), backgroundColor: 'transparent', marginBottom: paddingBotX }}>
            <FlatList
                data={this.ListImages}
                renderItem={this._renderItemImage}
                keyExtractor={(item, index) => `${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={ref => this.FLATLIST = ref}
            />
            {/* <Image
                defaultSource={Images.icPhotoBlack}
                source={Images.hotel} style={{ height: sizes.sizes.nImgSize80, width: sizes.sizes.nImgSize80, marginRight: 2 }} resizeMode='cover'
            /> */}
        </View>
    };

    _goback = () => {
        Utils.goback(this);
    }

    _onchangeImage = (index) => {
        this.FLATLIST.scrollToIndex({ index });
    }

    render() {
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: 'transparent' }]}>
                <ImageViewer
                    onChange={this._onchangeImage}
                    swipeDownThreshold={200}
                    index={this.state.index}
                    loadingRender={() => <ActivityIndicator color='white' size='large' />}
                    enablePreload={true}
                    onSwipeDown={this._goback}
                    enableSwipeDown
                    imageUrls={this.ListImages}
                    renderFooter={this._renderFooter}
                />
                <View style={{ width: nstyles.Width(100), backgroundColor: 'transparent', position: 'absolute', left: 0, top: 0, right: 0 }}>
                    <HeaderCom nthis={this}
                        iconLeft={Images.icbackspace}
                        tintColorLeft={'white'}
                        titleText={this.titleText}
                        iconRight={Images.icbaselineNotificationsNone24Px}
                        hiddenIconRight={true}
                    />
                </View>
            </View>
        );
    }
}