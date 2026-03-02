import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ImageSourcePropType } from 'react-native';

export { };
declare global {
  export type MasterData = {
  };

  export enum UiState {
    New = 1,
    Loading,
    Error,
    Normal,
  }

  export type BaseProps<V extends object | undefined = object | undefined> = {
    navigation: NativeStackNavigationProp<Record<string, V>>;
    route: RouteProp<Record<string, V>>;
    sender: BaseProps;
    index: number;
    type: string;
    data: any;
    request: any;
    isRequesting: boolean;
    message: string;
  };

  type BaseState = {
    type: string | undefined;
    canBack: boolean | undefined;
    uiState: UiState | undefined;
  };

  type DeviceReducerState = {
    index: number;
    sender: BaseProps;
    type: string;
    request: any;
    data: any;
    isRequesting: boolean;
    message: string;
  };

  type GlobalReducerState = {
    deviceReducer: DeviceReducerState;
  };

  export type ImagePreviewSource = {
    sources: Array<ImageSourcePropType>;
    title: string;
    index: number;
    category: string;
  };

  export type ApiResponse = {
    message: string;
  };
}
