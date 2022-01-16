import React, { Component } from 'react'
import { requireNativeComponent, Animated, Platform, processColor } from 'react-native';

const NativeHTSelectedLabel = requireNativeComponent('HTSelectedLabel')

const AnimatedHTSelectedLabel = Animated.createAnimatedComponent(NativeHTSelectedLabel)

export default class HTSelectedLabel extends Component {

	convertColor = (color) => {
		return Platform.select({
        	ios: color,
        	android: color ? processColor(color) : null
        })
	}

	render() {
		let reloadProps = {
	        ...this.props,
	        normalColor: this.convertColor(this.props.normalColor),
	        selectedColor: this.convertColor(this.props.selectedColor)
	    }
	    return <AnimatedHTSelectedLabel {...reloadProps} />
	}

}
