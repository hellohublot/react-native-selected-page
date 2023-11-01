import React, { Component } from 'react'
import { requireNativeComponent, Animated, Platform, processColor } from 'react-native';

const NativeHTSelectedLabel = requireNativeComponent('HTSelectedLabel')

const AnimatedHTSelectedLabel = Animated.createAnimatedComponent(NativeHTSelectedLabel)

export default AnimatedHTSelectedLabel