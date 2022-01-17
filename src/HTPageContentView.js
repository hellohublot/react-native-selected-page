import React, { Component } from 'react'
import { View, Text, FlatList, Platform, Animated, Dimensions } from 'react-native'
import ViewPager from 'react-native-pager-view'
import PropTypes from 'prop-types'

const SCREEN_WIDTH = Dimensions.get('window').width

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const AnimatedViewPager = Animated.createAnimatedComponent(ViewPager)

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
	}

	constructor(props) {
		super(props)
		let initScrollIndex = this.props.initScrollIndex ?? 0
		let animatedNativeEvent = {}
		if (Platform.OS == 'ios') {
			this._contentOffsetValueX = new Animated.Value(initScrollIndex * this.scrollViewWidth())
			this._contentSizeValueWidth = new Animated.Value(this.scrollViewWidth())
			this.scrollPageIndexValue = Animated.divide(this._contentOffsetValueX, this._contentSizeValueWidth)
			animatedNativeEvent = {
				contentOffset: {
                    x: this._contentOffsetValueX
                },
			}
		} else {
			this._offsetValue = new Animated.Value(0)
			this._positionValue = new Animated.Value(initScrollIndex)
			this.scrollPageIndexValue = Animated.add(this._offsetValue, this._positionValue)
			animatedNativeEvent = {
				offset: this._offsetValue,
                position: this._positionValue
			}
		}
		this.event = Animated.event([{
            nativeEvent: animatedNativeEvent
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
			if (Platform.OS == 'ios') {
				let scrollConfig = { index: pageIndex, animated: animated }
				this?.scrollView?.scrollToIndex && this?.scrollView?.scrollToIndex(scrollConfig)
			} else {
				if (animated) {
					this?.scrollView?.setPage && this.scrollView.setPage(pageIndex)
				} else {
					this?.scrollView?.setPageWithoutAnimation && this.scrollView.setPageWithoutAnimation(pageIndex)
				}
			}
		} catch(e) {
		}
	}

	_renderItem = (item, index, useViewPager = false) => {
		return (
			<View key={index} style={{ width: this.scrollViewWidth(), height: '100%' }}>
			{
				this.props.renderItem({item, index})
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
		return Platform.select({
			ios: (
				<AnimatedFlatList
					{...this.props}
					ref={this._ref}
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
			),
			android: (
				<View style={{flex: 1, overflow: 'hidden'}}>
					<AnimatedViewPager
						{...this.props}
						ref={this._ref}
						style={{ width: '100%', height: '100%', ...this?.props?.style }}
						initialPage={this.props.initScrollIndex}
						onPageScroll={this.event}
					>
						{
							this.props.data.map((item, index) => {
								return this._renderItem(item, index, true)
							})
						}
					</AnimatedViewPager>
				</View>
			)
		})
	}

}