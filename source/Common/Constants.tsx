import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
const baseSize = widthScreen < heightScreen ? widthScreen : heightScreen;

var settingVer = 1;
// var scale = Platform.OS == 'android' ? (DeviceInfo.isTablet() ? 8 : 2) : (DeviceInfo.isTablet() ? 8 : 4);
var scale = DeviceInfo.isTablet() ? 0.002 : 0.005;
const baseWidth = 375;
const baseHeight = 812;
const scaleFactor = Math.min(widthScreen / baseWidth, heightScreen / baseHeight);

var fontMaintain = Platform.OS === 'ios' ? scaleFactor : 1;

// Alert(`${(baseSize * scale) + ""}`, `${(baseSize * scale) + ""}`)
export default {
  useAxios: true,
  ScreenSize: {
    width: widthScreen,
    height: heightScreen,
    base: baseSize,
  },
  MeasureSize: (number: any): number => {
    return Math.ceil((baseSize / 2) * number * scale);
  },
  IS_ANDROID: Platform.OS === 'android',
  IS_IOS: Platform.OS === 'ios',
  allowProvince: 'đà nẵng',
  IsTablet: DeviceInfo.isTablet(),
  LandscapeMode: widthScreen > heightScreen,
  FONTS: Platform.select({
    android: {
      BOLD: 'SVN-Poppins-Bold',
      SEMI_BOLD: 'SVN-Poppins-SemiBold',
      MEDIUM: 'SVN-Poppins-Medium',
      REGULAR: 'SVN-Poppins-Regular',
    },
    ios: {
      BOLD: 'SVN-Poppins',
      SEMI_BOLD: 'SVN-Poppins',
      MEDIUM: 'SVN-Poppins',
      REGULAR: 'SVN-Poppins',
    },
  }),
  Screen: {
    Splash: 'StartApp',
    Login: 'Login',
    OTP: 'OTP',
    TermOfUse: 'TermOfUse',
    Policy: 'Policy',
    Registration: 'Registration',
  },
  FontSize: {
    s6: 6 * fontMaintain,
    s7: 7 * fontMaintain,
    s8: 8 * fontMaintain,
    s9: 9 * fontMaintain,
    s10: 10 * fontMaintain,
    s11: 11 * fontMaintain,
    s11d5: 11.5 * fontMaintain,
    s12: 12 * fontMaintain,
    s13: 13 * fontMaintain,
    s14: 14 * fontMaintain,
    s15: 15 * fontMaintain,
    s16: 16 * fontMaintain,
    s17: 17 * fontMaintain,
    s18: 18 * fontMaintain,
    s19: 19 * fontMaintain,
    s20: 20 * fontMaintain,
    s21: 21 * fontMaintain,
    s22: 22 * fontMaintain,
    s23: 23 * fontMaintain,
    s24: 24 * fontMaintain,
    s25: 25 * fontMaintain,
    s26: 26 * fontMaintain,
    s27: 27 * fontMaintain,
    s28: 28 * fontMaintain,
    s29: 29 * fontMaintain,
    s31: 31 * fontMaintain,
    s32: 32 * fontMaintain,
    s33: 33 * fontMaintain,
  },
  Store: {
    Settings: '@App:Settings' + settingVer,
    FirstLaunch: '@App:FirstLaunch' + settingVer,
    Session: '@App:Session' + settingVer,
    Version: '@App:Version' + settingVer,
    Master: '@App:Master' + settingVer,
    AppLang: '@App:AppLang' + settingVer,
    DataLang: '@App:DataLang' + settingVer,
    AppDataVersion: '@App:AppDataVersion' + settingVer,
    ContentDataVersion: '@App:ContentDataVersion' + settingVer,
    VersionConfig: '@App:VersionConfig' + settingVer,
    RegisteredDevice: '@App:RegisteredDevice' + settingVer,
    Categories: '@App:Categories' + settingVer,
  },
  Event: {
  },
};
