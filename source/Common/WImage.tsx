import {
  ColorValue,
  Image,
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from 'react-native';
import React from 'react';

interface Props extends ImageProps {
  source: ImageSourcePropType;
  h?: number | string;
  w?: number | string;
  size?: number;
  style?: StyleProp<ImageStyle>;
  color?: ColorValue;
}

function WImage({
  source,
  h,
  w,
  size,
  resizeMode = 'contain',
  style,
  color,
  ...props
}: Props) {
  return (
    <Image
      resizeMode={resizeMode}
      source={source}
      style={
        [
          (h || size) && { height: size || h },
          (w || size) && { width: size || w },
          color && { tintColor: color },
          style,
        ] as StyleProp<ImageStyle>
      }
      {...props}
    />
  );
}

export default WImage;
