import React, { Component } from 'react';
import { Animated, ViewStyle, ScaleTransform } from 'react-native';

interface HTSelectedLabelProps {
  text: string;
  normalColor: string;
  selectedColor: string;
  selectedScale: number;
  style: ViewStyle;
}

export default class HTSelectedLabel extends Component<HTSelectedLabelProps> {
  override render() {
    const { text, normalColor, selectedColor, selectedScale, style, ...rest } = this.props;
    const scale = (style?.transform?.[0] as ScaleTransform)?.scale as Animated.Value;
    const color = scale.interpolate({
      inputRange: [1, selectedScale],
      outputRange: [normalColor, selectedColor],
    });

    return (
      <Animated.Text {...rest} style={[style, { color }]}>
        {text}
      </Animated.Text>
    );
  }
}
