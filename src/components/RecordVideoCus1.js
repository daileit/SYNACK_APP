import React, { Component } from 'react';
import { nstyles, nwidth, nheight, Width, Height, paddingBotX } from '../styles/styles'

import {
  Text, StyleSheet, View, StatusBar, CameraRoll, Keyboard,
  TouchableOpacity, Image, Platform, ImageBackground, PermissionsAndroid
} from 'react-native';

import { Images } from '../images';
import Utils from '../app/Utils';
import moment from 'moment'
import { sizes } from '../styles/size';

import { RNCamera } from 'react-native-camera';
import { colors } from '../styles/color';
import ImageEditor from "@react-native-community/image-editor";
import { RootLang } from '../app/data/locales';

//styles màn hình popupMore
const stTakeCamera = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  imgPreview: {
    borderColor: colors.white,
    borderWidth: 1.5
  },
  timer: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 18
  },
  circle: {
    width: 18,
    height: 18,
    backgroundColor: '#d8541c',
    borderRadius: 9,
    marginRight: 5,
  }
});

/**
 * This is the component wich allow the user to film, or should be
*/

function Timer({ interval }) {
  const pad = (n) => n < 10 ? '0' + n : n
  const duration = moment.duration(interval)
  // const centiseconds = Math.floor(duration.milliseconds() / 10);
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={stTakeCamera.timer}>{pad(duration.minutes())}:</Text>
      <Text style={stTakeCamera.timer}>{pad(10 - duration.seconds())}</Text>
    </View>
  )
}

export default class RecordVideoCus1 extends Component {
  constructor(props) {
    super(props);
    //--Options default
    this.option = {
      typeDefault: 'back',
      showLeft: true,
      showRight: true,
      isAudio: true,
      response: () => { }
    };
    this.option = {
      ...this.option,
      ...this.props.navigation.state.params //--options custom
    }
    //--
    this.state = {
      type: this.option.typeDefault,
      isRecording: false,
      iconVid: "play",
      cancel: 1,   // 1: take picture, 2: preview picture
      currentTime: 0.0,
      opacityView: 1,
      recordOptions: {
        quality: RNCamera.Constants.VideoQuality['480p'],
      },
      defaultPhoto: undefined,
      start: 0,
      now: 0,
    };
  }

  UNSAFE_componentWillMount() {
    StatusBar.setHidden(true);
    Keyboard.dismiss();
    if (!this.option.showLeft)
      return;
    if (Platform.OS == 'ios')
      this.loadMedia();
    else
      this.androidRequestPermissionAndLoadMedia();
  }

  componentWillUnmount() {
    StatusBar.setHidden(false);
    Keyboard.dismiss();
    clearInterval(this.timer)
  }

  loadMedia = () => {
    let paramsCamera = {
      first: 1,
      assetType: 'Videos' //--set type - all, photos, videos
    };
    if (Platform.OS == 'ios')
      paramsCamera.groupTypes = 'All';
    CameraRoll.getPhotos(paramsCamera)
      .then(r => {
        let Temp = r.edges[0].node.image.uri;
        this.setState({ defaultPhoto: Temp });
      },
        (reason) => {
          if (reason.toString().includes('User denied access') && Platform.OS == 'ios')
            this.setState({ permissionIOS: false });
        })
      .catch((err) => {
        Utils.nlog('no ok');
        //Error Loading Images
      });
  }

  checkAndroidPermission = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
      Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
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

  androidRequestPermissionAndLoadMedia = () =>
    this.androidRequestReadStoragePermission()
      .then(() => {
        this.setState({ missingPermission: false });
        this.loadMedia();
      })
      .catch(() => this.setState({ missingPermission: true }));

  postFeeds = (optionsCus) => () => {
    Keyboard.dismiss();
    if (optionsCus == undefined || optionsCus == null)
      optionsCus = {};
    //--Open dialog choose media - ncustom
    response = (res) => {
      if (res.iscancel) {
        //--ko chon item or back
        // if (modefeeds == 1)
        // Utils.goback(this);
      }
      else if (res.error) {
        //--lỗi khi chon media
      }
      else {
        //--dữ liệu media trả về là 1 item or 1 mảng item
        //--Xử lý dữ liệu trong đây-----
        Utils.nlog('img', res);
        this.setState({ dataMedia: res });
        //-----
      }
    };
    options = {
      assetType: 'Videos', //All,Videos,Photos - default
      multi: false,// chọn 1 or nhiều item
      response: response, // callback giá trị trả về khi có chọn item
      limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
      showTakeCamera: false,
      ...optionsCus
    };
    Utils.goscreen(this, 'Modal_MediaPicker', options);
    //--End dialog media
  }

  checkCancel = () => {
    cancel = this.state.cancel;
    if (cancel == 1) {
      Utils.goback(this);
    }
    else {
      this.setState({ cancel: 1 });
    }
  }

  changeType = () => {
    type = this.state.type;
    if (type == "back") {
      this.setState({ type: 'front' })
    }
    else {
      this.setState({ type: 'back' })
    }
  }

  start = () => {
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
    }, () => {
      this.timer = setInterval(() => {
        let tempNow = new Date().getTime();
        this.setState({ now: tempNow });
        //-limited record video
        const timer = tempNow - this.state.start;
        if (timer >= 10000) {
          this.recordVideo();
        }
      }, 100);
    });
  }

  stop = () => {
    clearInterval(this.timer)
    const { now, start } = this.state
    this.setState({
      start: 0,
      now: 0,
    })
  }

  // saveVideo = async (data) => {
  //   CameraRoll.saveToCameraRoll(data, "video");
  //   Utils.nlog('xong');
  // }

  recordVideo = () => {
    if (this.camera) {
      if (this.state.isRecording === false) {
        this.start();
        this.setState({ isRecording: true, iconVid: "stop" });
        this.camera.recordAsync().then(async data => {
          // Utils.nlog(data);
          this.onPlayVideo(data);
          //--Save video xuong thiết bị - có thể bỏ nếu ko cần
          // if (Platform.OS === 'android') {
          //   await this.checkAndroidPermission();
          // }
          // CameraRoll.saveToCameraRoll(data.uri, "video");
          //-----
        }).catch((err) => {
          Utils.nlog(err);
        });
        Utils.nlog("Device is Recording");
      } else {
        this.camera.stopRecording()
        this.stop();
        this.setState({
          isRecording: false,
          iconVid: "play"
        });
        Utils.nlog("Stop Recording");
      }
    }
  };

  onPlayVideo = (data) => {
    let nthisTemp = this;
    let onSend = () => {
      nthisTemp.setState({ opacityView: 0 });
      //--
      nthisTemp.option.response(data);
      //--
      Utils.goback(nthisTemp);
    }

    Utils.goscreen(this, 'Modal_PlayMedia', { source: data.uri, onSend: onSend });
  }

  onSubmit = () => {
    this.option.response(this.takePictureData);
    Utils.goback(this);
  }

  render() {
    const { now, start } = this.state
    const timer = now - start;
    let widthIMGConten = Width(100) + 50;
    let heoghtIMGConten = widthIMGConten * 1008 / 1080;
    return (
      <View style={[stTakeCamera.container, { opacity: this.state.opacityView }]}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={stTakeCamera.preview}
          type={this.state.type}
          captureAudio={this.option.isAudio}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{ title: 'Permission to use camera', message: 'We need your permission to use your camera phone' }}
        >

          {/* Custom component in Camera View */}
          <View style={[nstyles.position, { bottom: 0 }]}>
            <View style={{ flex: 1, backgroundColor: colors.black_30 }} />
            <Image style={{ width: widthIMGConten, height: heoghtIMGConten, marginHorizontal: -25 }}
              source={Images.icFocusFace} resizeMode='contain' />
            <View style={{ backgroundColor: colors.black_30, height: '35%', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text style={{ color: colors.white, textAlign: 'center', maxWidth: 300, fontStyle: 'italic', marginBottom: 20 }}>
                {RootLang.lang.Alignthe_circle}
              </Text>
              <View style={[nstyles.nrow, {
                justifyContent: 'space-around', width: '100%',
                alignItems: 'flex-end', marginBottom: 30 + paddingBotX
              }]}>
                <TouchableOpacity onPress={this.postFeeds()} style={{ opacity: this.option.showLeft ? 1 : 0 }}
                  disabled={!this.option.showLeft}>
                  <Image style={[nstyles.nAva50, stTakeCamera.imgPreview]} source={{ uri: this.state.defaultPhoto }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.takePicture} disabled={timer != 0}>
                  <Image style={[nstyles.nAva70, { tintColor: this.state.isRecording ? '#f3780c' : 'white' }]} source={Images.icRecordVideo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.changeType} style={{ opacity: this.option.showRight ? 1 : 0 }}
                  disabled={this.state.isRecording && this.option.showRight || !this.option.showRight}>
                  <Image style={nstyles.nIcon40} source={Images.icCameraSwitchWhite} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </RNCamera>

        <TouchableOpacity style={{ position: 'absolute', top: 20, left: 20, right: 0, bottom: 0, width: 30, height: 30, zIndex: 2 }}
          onPress={() => this.checkCancel()}>
          <Image source={Images.icCloseWhite} style={nstyles.nIcon28} />
        </TouchableOpacity>
        {
          this.state.isRecording ?
            <View style={{
              position: 'absolute', top: 20, justifyContent: 'center',
              left: 0, right: 0, flexDirection: 'row'
            }}>
              <View style={[nstyles.nrow, {
                alignItems: 'center', paddingHorizontal: 12,
                paddingVertical: 9
              }]}>
                <View style={{
                  position: 'absolute', top: 0, bottom: 0, borderRadius: 5,
                  left: 0, right: 0, backgroundColor: 'black', opacity: 0.3
                }} />
                <View style={stTakeCamera.circle} />
                <Timer interval={timer} />
              </View>
            </View>
            : null
        }
        {
          this.state.cancel == 2 ?
            <ImageBackground resizeMode="contain" style={{
              position: 'absolute', top: 0, left: 0,
              right: 0, bottom: 0, backgroundColor: colors.black
            }} source={{ uri: this.state.defaultPhoto }}>
              <TouchableOpacity style={{ position: 'absolute', right: 20, bottom: 20 + paddingBotX }}
                onPress={this.onSubmit}>
                <Image source={Images.icSendMsg} resizeMode='contain' style={nstyles.nAva60} />
              </TouchableOpacity>
            </ImageBackground>
            : null
        }
      </View>
    );
  }

  cropImg = async (item, downSize = 1) => {
    let uri = item.uri;
    let width = item.width;
    let height = item.height;
    let widthCrop = width - width * 0.16;
    let heightCrop = widthCrop * 4.4 / 3;

    let tempX = width * 0.08;
    let tempY = height - height * 0.35 - heightCrop;

    if (Platform.OS == 'android') {
      widthCrop = width - width * 0.42;
      heightCrop = widthCrop * 4.2 / 3;

      tempX = width * 0.2;
      tempY = height *  0.09;
    }

    uriReturn = await ImageEditor.cropImage(
      uri,
      {
        offset: { x: tempX, y: tempY },
        size: { width: widthCrop, height: heightCrop },
        displaySize: { width: widthCrop, height: heightCrop }
      }
    );
    return { uri: uriReturn, width: widthCrop, height: heightCrop };
  }

  saveImage = async (data) => {
    CameraRoll.saveToCameraRoll(data, 'photo');
  }

  takePicture = async () => {
    if (this.camera) {
      try {
        const options = { quality: 0.5, forceUpOrientation: true, fixOrientation: true };
        const data = await this.camera.takePictureAsync(options);
        let tempImg = await this.cropImg(data);
        //--
        this.takePictureData = tempImg;
        console.log(' takePicture:', tempImg)
        this.setState({ defaultPhoto: tempImg.uri, cancel: 2 });
        // this.saveImage(data.uri);
        // console.log(data);
      } catch (error) {
        console.log('error takePicture', error)
      };
    }
  }


  //---End
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   preview: {
//     flex: 1,
//     justifyContent: "center",
//     flexDirection: "row",
//     alignItems: "flex-end",
//   },
//   iconCamera: {
//     color: "#ff4459",
//     marginBottom: 50,
//   },

// });