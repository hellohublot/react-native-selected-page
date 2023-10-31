import React from 'react'
import { Animated } from 'react-native'

export default React.forwardRef((props, ref) => (
    <Animated.FlatList 
        {...props}
        ref={ref}
    />
))