import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Animated, Easing, LayoutAnimation, PixelRatio } from 'react-native'
import HTSelectedLabel from './HTSelectedLabel'
import HTPageHeaderCursor from './HTPageHeaderCursor'


export default class HTPageHeaderView extends Component {

	static propTypes = {
		data: PropTypes.array,
		itemContainerStyle: PropTypes.object,
		itemSpace: PropTypes.number,
		renderItem: PropTypes.func,
		titleFromItem: PropTypes.func,
		itemTitleStyle: PropTypes.object,
		itemTitleNormalStyle: PropTypes.object,
		itemTitleSelectedStyle: PropTypes.object,
		cursorStyle: PropTypes.object,
		onSelectedPageIndex: PropTypes.func,
		shouldSelectedPageIndex: PropTypes.func
	}

	static defaultProps = {
		itemSpace: 0,
		horizontal: true,
		showsHorizontalScrollIndicator: false,
		showsVerticalScrollIndicator: false,
		contentInsetAdjustmentBehavior: 'never',
		automaticallyAdjustContentInsets: false,
		bounces: false,
	}

	constructor(props) {
		super(props)
		this.scrollPageIndexValue = new Animated.Value(this.props.initScrollIndex ?? 0)
		this.shouldHandlerAnimationValue = true
		this.itemContainerStyle = { height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...this.props.itemContainerStyle }
		let itemTitleStyle = { fontSize: 15, color: '#666', ...this.props.itemTitleStyle }
		this.itemTitleNormalStyle = { fontSize: 16, color: '#333', ...itemTitleStyle, ...this.props.itemTitleNormalStyle }
		this.itemTitleSelectedStyle = { fontSize: 20, color: '#666', ...this.itemTitleNormalStyle, ...this.props.itemTitleSelectedStyle }
		this.cursorStyle = { position: 'absolute', bottom: 0, width: '50%', height: 1 / PixelRatio.get(), backgroundColor: '#999', ...this.props.cursorStyle }
	}

	bindScrollPageIndexValue = (scrollPageIndexValue) => {
		this.scrollPageIndexValue = scrollPageIndexValue
		this.shouldHandlerAnimationValue = false
		this.forceUpdate()
	}

	componentWillUnmount() {
		this.scrollPageIndexValue.removeAllListeners()
	}

	_animation = (key, value, duration, native, complete) => {
		Animated.timing(key, {
			toValue: value,
			duration: duration,
			easing: Easing.inOut(Easing.ease),
			useNativeDriver: native,
		}).start(complete)
	}

	_itemTitleProps = (item, index) => {
		let fontScale = 1 + (this.itemTitleSelectedStyle.fontSize - this.itemTitleNormalStyle.fontSize) / this.itemTitleNormalStyle.fontSize
		if (fontScale == 1) {
			fontScale = 1.0001
		}
		let scale = this.scrollPageIndexValue.interpolate({
            inputRange: [index - 2, index - 1, index, index + 1, index + 2],
            outputRange: [1, 1, fontScale, 1, 1]
        })
		let titleStyle = {
			...this?.props?.itemTitleStyle,
			normalColor: this.itemTitleNormalStyle.color,
			selectedColor: this.itemTitleSelectedStyle.color,
			selectedScale: fontScale,
			text: this?.props?.titleFromItem ? this?.props?.titleFromItem(item, index) : item,
			style: {
				...this?.props?.itemTitleStyle,
				transform: [{ scale }]
			},
		}
		return titleStyle
	}

	_renderTitle = (item, index) => {
		return (
			<HTSelectedLabel {...this._itemTitleProps(item, index)}>
			</HTSelectedLabel>
		)
	}

	_itemDidTouch = (item, index) => {
		if (this.props.shouldSelectedPageIndex) {
			let result = this.props.shouldSelectedPageIndex()
			if (result == false) {
				return
			}
		}
		if (this.shouldHandlerAnimationValue) {
			this._animation(this.scrollPageIndexValue, index, 250, true)
		}
		this.props.onSelectedPageIndex(index)	
	}

	_renderItem = (item, index) => {
		let content = this?.props?.renderItem != null ? this.props.renderItem(item, index) : this._renderTitle(item, index)
		return (
			<Pressable key={index} style={this.itemContainerStyle} onLayout={(event) => this.cursor?._onLayoutItemContainer(event, item, index)} onPress={() => this._itemDidTouch(item, index)}>
			{
				content
			}
			</Pressable>
		)
	}

	_renderCursor = () => {
		return (
			<HTPageHeaderCursor 
				ref={ref => this.cursor = ref}
				data={this.props.data}
				scrollPageIndexValue={this.scrollPageIndexValue}
				renderCursor={this.props.renderCursor}
				cursorStyle={this.cursorStyle}
			/>
		)
	}

	_ref = (ref) => {
		this.scrollView = ref
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.data != this.props.data) {
			return true
		}
		return false
	}

	render() {
		return (
			<View style={this.props.style}>
				<ScrollView
					{...this.props}
					contentContainerStyle={{ width: this.itemContainerStyle?.flex ? '100%' : null, ...this?.props.scrollContainerStyle }}
					ref={(ref) => this._ref(ref)}
				>
					<View style={[StyleSheet.absoluteFill, {...this?.props?.containerStyle}]}></View>
					<View style={{ minWidth: '100%', flexDirection: 'row', alignItems: 'center', ...this?.props?.contentContainerStyle}}>
						{
							this._renderCursor()
						}
						{
							this?.props?.data?.map((item, index) => {
								return this._renderItem(item, index)
							})
						}
					</View>
				</ScrollView>
			</View>
		)
	}

}