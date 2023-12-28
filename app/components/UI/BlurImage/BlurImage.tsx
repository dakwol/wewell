import React, {FC} from 'react';
import {Image, ImageResizeMode, ImageStyle} from 'react-native';

type IBlurImageProps = {
    resizeMode: ImageResizeMode | undefined;
    media:any;
    style: ImageStyle | undefined;
    resizeMethod?: 'auto' | 'resize' | 'scale' | undefined;
    blurRadius?: number;
    blur?: boolean,
  };

const BlurImage:FC<IBlurImageProps> = ({
                                           media,
                                           blurRadius= 15,
                                           blur= false,
                                           ...props
}) => {

  return (
    <Image
        source={media}
        style={props.style}
        blurRadius={ (blur) ? blurRadius : 0 }
        resizeMode={props.resizeMode}
        resizeMethod={props.resizeMethod}
    />
  );
};
export default BlurImage;
