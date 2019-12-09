import React, { Component, PureComponent } from 'react';
import {
    Image, View, StyleSheet, Text, Platform,
    Alert, TouchableOpacity, Dimensions, CameraRoll, PermissionsAndroid,
    FlatList, RefreshControl, ScrollView, Linking
} from 'react-native';

//import ListEmpty from './nCustoms/ListEmpty'
import { nstyles, colorWhite, nwidth } from '../styles/styles';
import Utils from '../app/Utils';
import { Images } from '../images';
import HeaderCom from './HeaderCom';
import { RootLang } from '../app/data/locales';
import { colors } from '../styles';

const stMediaPicker = StyleSheet.create({

});

let isend = true;
let isLoadImg = false;
let sindeximg = '';
export default class MediaPicker extends Component {
    constructor(props) {
        super(props);
        options = { //DEFAULT OPTIONS
            assetType: 'All',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response: () => { }, // callback giá trị trả về khi có chọn item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
            showTakeCamera: true
        }
        options = {
            ...options,
            ...this.props.navigation.state.params //--options media
        };
        //----
        nthisMediaPicker = this;
        this.state = {
            //data globle
            isLoading: false,
            //data local
            missingPermission: false,
            photos: [],
            countChoose: 0,
            permissionIOS: true,
            indexNow: -1,
            sl: 51,
            opacityMain: 1
        }
        this.androidRequestPermissionAndLoadMedia();
    }

    UNSAFE_componentWillMount = async () => {
        if (Platform.OS == 'ios') {
            this.loadMedia();
        }
        else {
            this.androidRequestPermissionAndLoadMedia();
        }
    }

    componentWillUnmount = async () => {
        isend = true;
        sindeximg = '';
        isLoadImg = false;
    }

    loadMedia = async (ssl = 0) => {
        if (!isend) {
            isLoadImg = false;
            return;
        }
        let mtemp = this.state.photos.slice();
        let sl = this.state.sl;
        sl += ssl;
        let sidold = false;
        let paramsCamera = {
            first: sl,
            assetType: options.assetType //--set type - all, photos, videos
        };
        if (Platform.OS == 'ios')
            paramsCamera.groupTypes = options.groupTypes;
        CameraRoll.getPhotos(paramsCamera)
            .then(r => {
                var mlid = [];
                r.edges.map((item, index) => {
                    if (sidold || mtemp.length == 0) { // lần đầu load , hoặc lần sau khi check item cuối 
                        if (mtemp.length == 0 && options.showTakeCamera && mlid.length == 0) {
                            mlid.push({
                                idItem: this.state.photos.length.toString() + '_x',
                            });
                        }
                        mlid.push({
                            idItem: this.state.photos.length.toString() + '_' + index,
                            uri: item.node.image.uri,
                            timePlay: item.node.image.playableDuration,  // =0: img, >0: videos
                            height: item.node.image.height,
                            width: item.node.image.width,
                            ischoose: false
                        });
                        sindeximg = r.page_info.end_cursor;
                    }
                    if (item.node.image.uri == sindeximg) {
                        sidold = true;
                    }
                });
                //-----

                let mtempMain = [...mtemp, ...mlid];
                //-----
                isend = r.page_info.has_next_page;
                this.setState({ photos: mtempMain, sl: sl });
                // Utils.nlog('camera roll:', r, mtemp,mlid);

                isLoadImg = false;

            }, (reason) => {
                if (reason.toString().includes('User denied access') && Platform.OS == 'ios')
                    this.setState({ permissionIOS: false });
                isLoadImg = false;
            })
            .catch((err) => {
                Utils.nlog('no ok');
                isLoadImg = false;
                //Error Loading Images
            });
    };


    androidRequestReadStoragePermission() {
        return new Promise((resolve, reject) => {
            if (
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE) ===
                PermissionsAndroid.RESULTS.GRANTED
            ) {
                return resolve();
            }
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
                .then(result => {
                    if (result === PermissionsAndroid.RESULTS.GRANTED) {
                        resolve();
                    } else {
                        reject();
                    }
                })
                .catch(err => {
                    reject();
                    alert(err);
                });
        });
    }

    androidRequestPermissionAndLoadMedia = () => {
        this.androidRequestReadStoragePermission()
            .then(() => {
                this.setState({ missingPermission: false });
                this.loadMedia();
            })
            .catch(() => this.setState({ missingPermission: true }));
    }

    chooseItem = (index) => {
        let i = this.state.indexNow;
        let mtemp = this.state.photos;
        let icount = this.state.countChoose;
        //--gioi han sl chon
        if (options.multi && options.limitCheck > -1 && this.state.countChoose >= options.limitCheck && !mtemp[index].ischoose) {
            return;
        }
        //-----
        if (mtemp[index].ischoose)
            icount--; else icount++;
        if (i != -1)
            mtemp[i] = { ...mtemp[i], ischoose: false };
        mtemp[index] = { ...mtemp[index], ischoose: !mtemp[index].ischoose };

        this.setState({ photos: mtemp, countChoose: icount });
        this.setState({ photos: mtemp, countChoose: icount, indexNow: options.multi ? -1 : index });
    }

    prevMedia = () => {

    }

    onPlayVideo = (suri) => {
        Utils.goscreen(this, 'Modal_PlayMedia', { source: suri });
    }

    done = () => {
        let tdata = this.state.photos.slice();
        tdata = tdata.filter(item => item.ischoose);
        if (tdata.length == 0)
            options.response({ iscancel: true });
        else options.response(options.multi? tdata:tdata[0]);
        Utils.goback(this);
    }

    onResponse = (item, isok) => {
        if (isok) {
            Utils.goback(this);
            options.response(item);
        } else {
            this.setState({ opacityMain: 1 });
        }
    }

    _openCamrera = () => {
        Utils.goscreen(this, 'Modal_TakeCamera', { onResponse: this.onResponse, showLeft: false });
        this.setState({ opacityMain: 0 });
    }

    renderItem = ({ item, index }) => {
        if (index == 0 && options.showTakeCamera) return (
            <TouchableOpacity activeOpacity={0.9}
                style={[nstyles.nmiddle, {
                    backgroundColor: colors.black_60,
                    width: (nwidth - 30) / 3, height: (nwidth - 30) / 3, marginRight: 5, marginTop: 5,
                    borderColor: '#E8E8E9', borderWidth: 0.5
                }]} onPress={this._openCamrera}>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        tintColor: colors.white
                    }}
                    resizeMode='contain'
                    source={Images.icCameraBlack}
                />
            </TouchableOpacity>
        )
        else return <ItemImage item={item} index={index} onPlayVideo={this.onPlayVideo}
            chooseItem={this.chooseItem} prevMedia={this.prevMedia} />
    }

    render() {
        return (
            <View style={[nstyles.ncontainerX, { opacity: this.state.opacityMain }]}>
                {/* Header  */}
                <HeaderCom nthis={this}
                    onPressLeft={() => { options.response({ iscancel: true }); Utils.goback(this); }}
                    iconLeft={Images.icCloseWhite}
                    titleText={'Thư viện hình ảnh'}
                />
                {/* <View style={nstyles.nhead}>
                    <View style={nstyles.nHcontent}>
                        <View style={nstyles.nHleft}>
                            <TouchableOpacity onPress={() => { options.response({ iscancel: true }); Utils.goback(this); }}>
                                <Image source={Images.icCloseWhite} style={{ width: 28, height: 28 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={nstyles.nHmid}>
                            <Text style={nstyles.ntitle}>Thư viện hình ảnh</Text>
                        </View>
                        <View style={nstyles.nHright}>

                        </View>
                    </View>
                </View> */}
                {/* BODY */}
                <View style={nstyles.nbody}>
                    { //--hiện thị hỏi quyền khi IOS ko có quyền truy cập ảnh
                        this.state.permissionIOS ?
                            <View style={{ flex: 1 }}>
                                {
                                    options.limitCheck > 0 && options.multi && this.state.countChoose == options.limitCheck ?
                                        <View style={{ paddingVertical: 4, alignItems: 'center' }}>
                                            <Text style={[nstyles.ntext, { color: 'black', fontSize: 14 }]}>Chọn tối đa {options.limitCheck} hình ảnh</Text>
                                        </View> : null
                                }
                                <FlatList
                                    data={this.state.photos}
                                    style={{ flex: 1, backgroundColor: colorWhite, padding: 10, paddingRight: 5, paddingTop: 5, marginBottom: 60 }}
                                    ref={(ref) => { this.listCmts = ref; }}
                                    keyboardShouldPersistTaps='handled'
                                    keyboardDismissMode='interactive'
                                    onEndReachedThreshold={0.3}
                                    onEndReached={() => {
                                        if (this.state.photos.length != 0)
                                            this.loadMedia(30).done();
                                    }}
                                    renderItem={this.renderItem}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={3}
                                    keyExtractor={(item, index) => item.idItem}
                                />

                                <View style={[nstyles.nrow, {
                                    position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'space-between', padding: 10,
                                    alignItems: 'center'
                                }]}>
                                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, backgroundColor: "black", opacity: 0.8 }} />
                                    {
                                        options.multi ?
                                            <Text style={[nstyles.ntext, { color: colorWhite, fontWeight: "400" }]}>Đã chọn: {this.state.countChoose}</Text> : <Text />
                                    }
                                    <TouchableOpacity style={[nstyles.nbtn_Bgr, { backgroundColor: '#43C9AA', borderRadius: 4, paddingHorizontal: 18 }]} activeOpacity={0.9}
                                        onPress={() => { this.done() }}>
                                        <Text style={nstyles.ntextbtn_Bgr}>Chọn</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <TouchableOpacity style={[nstyles.nbtn_Bgr, {
                                borderRadius: 5, paddingHorizontal: 18, alignSelf: 'center',
                                paddingVertical: 5, backgroundColor: "#157EFB", marginTop: 20
                            }]} onPress={() => {
                                Linking.openURL('app-settings:').catch((err) => {
                                    Utils.nlog(err);
                                });
                            }}>
                                <Text style={[nstyles.ntextbtn_Bgr, { fontSize: 14 }]}>Đi đến cài đặt</Text>
                            </TouchableOpacity>
                    }
                </View>
                {/* <View style={{height:200,width:'100%',backgroundColor:'red'}}>
                    <PlayMedia />
                </View> */}
            </View>
        );
    }
}

class ItemImage extends PureComponent {
    render() {
        const { item, index, prevMedia, onPlayVideo, chooseItem } = this.props;
        // Utils.nlog(item.idItem);
        return (
            item.height == -1 ? null :
                <TouchableOpacity activeOpacity={0.9}
                    style={{
                        width: (nwidth - 30) / 3, height: (nwidth - 30) / 3, marginRight: 5, marginTop: 5,
                        borderColor: '#E8E8E9', borderWidth: 0.5
                    }} onPress={() => { prevMedia() }}>
                    <Image
                        style={{
                            width: (nwidth - 30) / 3,
                            height: (nwidth - 30) / 3,
                        }}
                        resizeMode='cover'
                        source={{ uri: item.uri }}
                    />
                    {/* nút play video */}
                    {
                        item.timePlay > 0 ?
                            <TouchableOpacity style={{
                                position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, justifyContent: 'center',
                                alignItems: 'center'
                            }} activeOpacity={0.9}
                                onPress={() => onPlayVideo(item.uri)}>
                                <Image
                                    style={{ width: 35, height: 35 }}
                                    resizeMode='contain'
                                    source={Images.mediaPlayButton}
                                />
                            </TouchableOpacity> : null
                    }
                    {/* nút chọn media */}
                    <TouchableOpacity style={{
                        position: 'absolute', top: 5, right: 5,
                        elevation: 2, shadowOffset: { width: 1, height: 1 },
                        shadowColor: 'black'
                    }} activeOpacity={0.9}
                        onPress={() => { chooseItem(index) }}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            resizeMode='cover'
                            source={item.ischoose ? Images.icChooseItemGreen : Images.icCheckboxWhite}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
        );
    }
}
