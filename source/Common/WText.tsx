/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  TextProps,
  TextStyle,
  StyleProp,
  FlexStyle,
  StyleSheet,
} from 'react-native';
import Constants from './Constants';
import Colors from './Colors';
import Style from './Style';

type FontType = 'bold' | 'medium' | 'regular' | 'semiBold';
type FontSizeKey = keyof typeof Constants.FontSize;
type ExtractNumber<S extends string> = S extends `s${infer N extends number}` ? N : never;
type FontNumber = ExtractNumber<FontSizeKey>;
const IOS_PADDING_TOP_ADJUSTMENT = 2;

interface WTextProps extends TextProps, Partial<TextStyle> {
  type: `${FontType}${FontNumber}`;
  style?: StyleProp<TextStyle>;

  /** Underline text */
  txtUnderline?: boolean;

  // Margin / Padding shortcuts
  marginTop?: FlexStyle['marginTop'];
  marginBottom?: FlexStyle['marginBottom'];
  marginLeft?: FlexStyle['marginLeft'];
  marginRight?: FlexStyle['marginRight'];
  marginHorizontal?: FlexStyle['marginHorizontal'];
  marginVertical?: FlexStyle['marginVertical'];

  // Layout shortcuts
  fill?: boolean;
  center?: boolean;
  capitalize?: boolean;
  mWidth?: string | number; // maxWidth
  minW?: string | number;
  maxW?: string | number;
  minHeight?: number;
  maxHeight?: number;

  numberOfLine?: number;
  color?: string; // Override color
  paddingTop?: FlexStyle['paddingTop'];
  paddingBottom?: FlexStyle['paddingBottom'];
  paddingVertical?: FlexStyle['paddingVertical'];
}

function WText(props: WTextProps) {
  const {
    type = 'regular14',
    style,
    children,
    txtUnderline,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginHorizontal,
    marginVertical,
    fill,
    center,
    capitalize,
    mWidth,
    minW,
    maxW,
    minHeight,
    maxHeight,
    numberOfLine,
    color = Colors.gray900,
    paddingTop,
    paddingBottom,
    paddingVertical,
    textAlign,
    adjustsFontSizeToFit,
    minimumFontScale,
    allowFontScaling,
    ...rest
  } = props;

  const flatStyle = StyleSheet.flatten(style || {}) as TextStyle;

  // iOS paddingTop adjustment
  let adjustedStyle = style;
  if (Constants.IS_IOS) {
    let paddingTopAdjustment = 0;
    if (flatStyle.padding !== undefined) {
      paddingTopAdjustment =
        (typeof flatStyle.padding === 'number' ? flatStyle.padding : 0) + IOS_PADDING_TOP_ADJUSTMENT;
    } else if (flatStyle.paddingVertical !== undefined) {
      paddingTopAdjustment =
        (typeof flatStyle.paddingVertical === 'number' ? flatStyle.paddingVertical : 0) +
        IOS_PADDING_TOP_ADJUSTMENT;
    } else if (flatStyle.paddingTop !== undefined) {
      paddingTopAdjustment =
        (typeof flatStyle.paddingTop === 'number' ? flatStyle.paddingTop : 0) +
        IOS_PADDING_TOP_ADJUSTMENT;
    }

    if (paddingTopAdjustment > 0) {
      adjustedStyle = [style, { paddingTop: paddingTopAdjustment }];
    }
  }

  return (
    <Text
      {...rest}
      allowFontScaling={adjustsFontSizeToFit ? true : (allowFontScaling ?? false)}
      numberOfLines={numberOfLine}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      style={[
        styles[type || 'regular14'],
        txtUnderline && { textDecorationLine: 'underline' },
        fill && { flex: 1 },
        center && { textAlign: 'center' },
        textAlign && { textAlign: textAlign },
        capitalize && { textTransform: 'capitalize' },
        marginTop !== undefined && { marginTop },
        marginBottom !== undefined && { marginBottom },
        marginLeft !== undefined && { marginLeft },
        marginRight !== undefined && { marginRight },
        marginHorizontal !== undefined && { marginHorizontal },
        marginVertical !== undefined && { marginVertical },
        paddingTop !== undefined && { paddingTop },
        paddingBottom !== undefined && { paddingBottom },
        paddingVertical !== undefined && { paddingVertical },
        mWidth !== undefined && { maxWidth: mWidth as any },
        minW !== undefined && { minWidth: minW as any },
        maxW !== undefined && { maxWidth: maxW as any },
        minHeight !== undefined && { minHeight },
        maxHeight !== undefined && { maxHeight },
        color && { color },
        style,
        adjustedStyle,
      ]}
    >
      {children}
    </Text>
  );
}

const makeTextStyle = (
  fontFamily: string,
  sizeKey: keyof typeof Constants.FontSize,
  fontType: FontType
): TextStyle => {
  const fontSize = Constants.FontSize[sizeKey];

  const fontWeightMap: Record<FontType, TextStyle['fontWeight']> = {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  };

  const availableSizes = [
    4, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 18,
    20, 22, 24, 28, 32, 34, 36, 38, 40, 42, 44,
    46, 48, 50, 52, 54, 56, 58, 60,
  ];
  const closestSize = availableSizes.reduce((prev, curr) =>
    Math.abs(curr - fontSize) < Math.abs(prev - fontSize) ? curr : prev
  );

  const baseStyleKey = `textFontSize${closestSize}` as keyof typeof Style;
  const baseStyle = Style[baseStyleKey] || {};

  // 🔥 fix lineHeight cho Android
  const lineHeightMultiplier = Constants.IS_IOS ? 1.5 : 1.67;

  return {
    ...baseStyle,
    fontFamily,
    fontSize,
    lineHeight: Math.round(fontSize * lineHeightMultiplier),
    color: Colors.gray900,
    ...(Constants.IS_IOS && { fontWeight: fontWeightMap[fontType] }),
  };
};

const fontFamilies: Record<FontType, string> = {
  bold: Constants.FONTS?.BOLD || '',
  medium: Constants.FONTS?.MEDIUM || '',
  regular: Constants.FONTS?.REGULAR || '',
  semiBold: Constants.FONTS?.SEMI_BOLD || '',
};

const styles: Record<string, TextStyle> = {};
for (const type of Object.keys(fontFamilies) as FontType[]) {
  for (const sizeKey of Object.keys(Constants.FontSize) as FontSizeKey[]) {
    const num = Number(sizeKey.slice(1));
    styles[`${type}${num}`] = makeTextStyle(fontFamilies[type], sizeKey, type);
  }
}

export default WText;
