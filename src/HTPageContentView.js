import React, { Component } from 'react'
import { View, Text, FlatList, Animated, Dimensions } from 'react-native'
import PropTypes from 'prop-types'

const SCREEN_WIDTH = Dimensions.get('window').width

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

export default class HTPagContentView extends Component {

	static propTypes = {
		data: PropTypes.array,
		renderItem: PropTypes.func,
	}

	static defaultProps = {
		horizontal: true,
		scrollEventThrottle: 1 / 60.0 * 1000,
		initialNumToRender: 2,
		showsHorizontalScrollIndicator: false,
		showsVerticalScrollIndicator: false,
		contentInsetAdjustmentBehavior: 'never',
		automaticallyAdjustContentInsets: false,
		bounces: false,
		pagingEnabled: true,
		keyExtractor: (item, index) => index
	}

	constructor(props) {
		super(props)
		let initScrollIndex = this.props.initScrollIndex ?? 0
		this._contentOffsetValueX = new Animated.Value(initScrollIndex * this.scrollViewWidth())
		this._layoutValueWidth = new Animated.Value(this.scrollViewWidth())
		this.scrollPageIndexValue = Animated.divide(this._contentOffsetValueX, this._layoutValueWidth)
		this.event = Animated.event([{
            nativeEvent: {
            	contentOffset: { x: this._contentOffsetValueX },
            	layoutMeasurement: { width: this._layoutValueWidth }
            }
        }], {
            useNativeDriver: true
        })
	}

	componentDidMount() {
		this.props.onInitScrollPageIndexValue && this.props.onInitScrollPageIndexValue(this.scrollPageIndexValue)
	}

	scrollViewWidth = () => {
		return this.props?.scrollViewWidth ?? SCREEN_WIDTH
	}

	scrollPageIndex = (pageIndex, animated = true) => {
		try {
			let scrollConfig = { index: pageIndex, animated: animated }
			this?.scrollView?.scrollToIndex && this?.scrollView?.scrollToIndex(scrollConfig)
		} catch(e) {
		}
	}

	_renderItem = (item, index, useViewPager = false) => {
		return (
			<View style={{ width: this.scrollViewWidth(), height: '100%' }}>
			{
				this.props.renderItem({ item, index })
			}
			</View>
		)
	}

	_ref = (ref) => {
		if (ref) {
			this.scrollView = ref
		}
	}

	render() {
		return (
			<AnimatedFlatList
				{...this.props}
				ref={ref => {
					this._ref(ref)
					this.props.scrollViewRef && this.props.scrollViewRef(ref)
				}}

				style={{ width: '100%', ...this?.props?.style }}
				renderItem={({item, index}) => this._renderItem(item, index)}
				onScroll={this.event}
				getItemLayout={(item, index) => ({
					length: this.scrollViewWidth(),
					offset: index * this.scrollViewWidth(),
					index
				})}
				contentOffset={{ x: (this.props?.initScrollIndex ?? 0) * this.scrollViewWidth(), y: 0 }}
			/>
		)
	}

}