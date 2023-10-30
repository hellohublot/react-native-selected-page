import React, { Component } from 'react'
import {
  Animated,
  PanResponder,
} from 'react-native';

export default class HTContentFlatList extends Component {
    constructor(props) {
        super(props)
        this.pageIndex = 0
        this.isDraging = false
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderMove: (_, gestureState) => this._onPanGestureMove(gestureState),
            onPanResponderTerminate: (_, gestureState) => this._onPanGestureEnd(gestureState),
            onPanResponderRelease: (_, gestureState) => this._onPanGestureEnd(gestureState),
            onPanResponderTerminationRequest: () => true,
        })
    }

    _onPanGestureMove = (gestureState) => {
        this.isDraging = true
        this.scrollView.scrollToOffset({ 
            animated: false, 
            offset: this.pageIndex * this.props.scrollViewWidth - gestureState.dx
        })
    }

    _onPanGestureEnd = (gestureState) => {
        const decelerationRate = 0.998
        let decelerationDistance = (gestureState.vx * gestureState.vx) / (2 * (1 - 0.998))
        decelerationDistance *= (gestureState.vx > 0 ? 1 : -1)
        const finallyDistance = decelerationDistance + gestureState.dx
        const reloadPageIndex = Math.abs(finallyDistance) * 2 >= this.props.scrollViewWidth ? this.pageIndex + (finallyDistance > 0 ? -1 : 1) : this.pageIndex
        this.scrollView.scrollToIndex({ 
            animated: true, 
            index: reloadPageIndex
        })
        this.isDraging = false
    }

    _onScroll = (event) => {
        this.props.onScroll && this.props.onScroll(event)
        if (this.isDraging) {
            return
        }
        const { nativeEvent: { contentOffset: { x } } } = event
        this.pageIndex = Math.round(x / this.props.scrollViewWidth)
    }

    scrollToIndex = (config) => {
        this.scrollView.scrollToIndex(config)
    }

    render() {
        return (
            <Animated.FlatList 
                {...this.props}
                {...this.panResponder.panHandlers}
                ref={ref => this.scrollView = ref} 
                pagingEnabled={false}
                scrollEnabled={false}
                disableScrollViewPanResponder={true}
                onScroll={this._onScroll}
            />
        )
    }
}

