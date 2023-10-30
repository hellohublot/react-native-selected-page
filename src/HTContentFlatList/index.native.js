import React from 'react'
import { Animated } from 'react-native'

export default React.forwardRef((props, ref) => (
    <Animated.FlatList 
        {...props}
        ref={ref}
        contentOffset={{ x: (this.props?.initScrollIndex ?? 0) * (this?.props?.scrollViewWidth ?? 0), y: 0 }}
    />
))