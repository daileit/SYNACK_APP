import {
    createStackNavigator, createBottomTabNavigator,
    createSwitchNavigator,
} from 'react-navigation';
import {
    Easing, Animated
} from 'react-native';

// -- Root Screen + Component native custom  *
import MsgBox from '../components/MsgBox';
import RootScreen from '../screens/RootScreen';
import SideMenu from '../components/SideMenu';
import BrowserInApp from '../components/BrowserInApp';
import DatePickList from '../components/DatePickList';
import MediaPicker from '../components/MediaPicker';
import TakeCamera from '../components/TakeCamera';
import RecordVideo from '../components/RecordVideo';
import RecordVideoCus1 from '../components/RecordVideoCus1'
import TakeCameraCus1 from '../components/TakeCameraCus1';
import PlayMedia from '../components/PlayMedia';

// -- Các màn hình App
import Home from '../screens/main/Home';
import Language from '../screens/Language';
import Login from '../screens/main/Login';
import CardUpload from '../screens/main/CardUpload';
import AvatarUpload from '../screens/main/AvatarUpload';
import ResultCheck from '../screens/main/ResultCheck';




// -- Demo
import RegisFace from '../screens/demo/RegisFace';
import SelectPerson from '../screens/demo/SelectPerson';
import InfoApp from '../screens/main/InfoApp';
import Settings from '../screens/main/Settings';
import User from '../screens/main/User';

//deepLink app123456://app/root/main
/**
 * Router app thêm vào đây
*/

const MainStack = createStackNavigator(
    {
        scHome: Home,
        scCardCheck: AvatarUpload,
        scAvatarUpload: AvatarUpload,
        scResultCheck: ResultCheck,
        scInfoApp: InfoApp,
        scSettings: Settings

    },
    {
        headerMode: 'none'
    }
);

const DemoStack = createStackNavigator(
    {
        scSelectPerson: SelectPerson,
        scRegisFace: RegisFace
    },
    {
        headerMode: 'none'
    }
);


/**
 * Router Gốc không thay đổi.
*/
const RootStack = createSwitchNavigator(
    {
        sw_Root: {
            screen: RootScreen,
            navigationOptions: {
                header: null
            }
        },
        sw_Login: {
            screen: Login,
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        },
        sw_Main: {
            screen: MainStack,
            path: 'main',
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        }

    },
    {
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);


// - Modal native -- Các screen dạng modal, popup khai báo ở đây
const RootModalStack = createStackNavigator(
    {
        Root: {
            screen: RootStack,
            path: 'root'
        },
        //-- Khai bao modal khong co Animations
        // -- Screen Modal, Popup
        Modal_User: User,



        //***** Modal components Chung * ko cần xoá ******
        Modal_Language: Language,
        Modal_BrowserInApp: BrowserInApp,
        Modal_DatePickList: DatePickList,
        Modal_RecordVideo: RecordVideo,
        Modal_RecordVideoCus1: RecordVideoCus1,
        Modal_TakeCameraCus1: TakeCameraCus1,
        Modal_TakeCamera: TakeCamera,
        Modal_PlayMedia: PlayMedia,
        Modal_MediaPicker: MediaPicker
        //***** END ******
    },
    {
        mode: 'modal',
        headerMode: 'none',
        transitionConfig: () => ({
            containerStyle: {
                backgroundColor: 'transparent'
            }
        }),
        transparentCard: true,
        cardStyle: {
            backgroundColor: 'transparent',
            opacity: 1
        }
    }
);


export const AppStack = createStackNavigator({
    RootMain: {
        screen: RootModalStack,
        path: 'app'
    },
    Modal_MsgBox: {
        screen: MsgBox,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    //-- Khai bao modal khong co Animations

},
    {
        mode: 'modal',
        headerMode: 'none',
        transitionConfig: () => ({
            containerStyle: {
                backgroundColor: 'transparent'
            },
            transitionSpec: {
                duration: 0,
                timing: Animated.timing,
                easing: Easing.step0,
            }
        }),
        transparentCard: true,
        cardStyle: {
            backgroundColor: 'transparent',
            opacity: 1
        }
    });