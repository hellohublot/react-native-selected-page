import React, { Component } from 'react'
import { requireNativeComponent, Animated, Platform, processColor } from 'react-native';

export default class HTSelectedLabel extends Component {

    render() {

        const { text, normalColor, selectedColor, selectedScale, style, ...rest } = this.props
        const { transform } = style
        const scale = transform[0].scale
        const color = scale.interpolate({
            inputRange: [1, selectedScale],
            outputRange: [normalColor, selectedColor]
        })

        return (
            <Animated.Text {...rest} style={[style, { color }]} children={text} />
        )
    }

}