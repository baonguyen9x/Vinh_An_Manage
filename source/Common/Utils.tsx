import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialIcons";

const VectorIcon: any = Icon;

export const MaterialIcon = ({ name, color = '#000', size = 24, style }: any) => (
    <VectorIcon name={name} size={size} color={color} style={style} />
);

export const GDPT_LOGO = ({ width = 96, height = 96, style }: any) => (
    <Svg viewBox="0 0 100 100" width={width} height={height} style={style}>
        <Circle cx="50" cy="50" r="48" fill="#008A45" />
        <Path
            d="M50 20 C50 20 65 45 65 65 C65 75 58 80 50 80 C42 80 35 75 35 65 C35 45 50 20 50 20Z"
            fill="white"
        />
        <Path
            d="M50 35 C50 35 75 50 75 70 C75 80 65 85 55 85 C45 85 40 80 40 70 C40 50 50 35 50 35Z"
            fill="white"
            opacity="0.8"
        />
        <Path
            d="M50 35 C50 35 25 50 25 70 C25 80 35 85 45 85 C55 85 60 80 60 70 C60 50 50 35 50 35Z"
            fill="white"
            opacity="0.8"
        />
    </Svg>
);