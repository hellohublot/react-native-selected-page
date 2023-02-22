import React, { Component, Fragment } from 'react'
import { View, Animated } from 'react-native'

export default class HTPageHeaderCursor extends Component {

	constructor(props) {
		super(props)
		this.itemContainerLayoutList = props.data.map(item => false)
	}

	_onLayoutItemContainer = (event, item, index) => {
		let itemContainerLayout = event.nativeEvent.layout
		if (itemContainerLayout == this.itemContainerLayoutList[index]) {
			return
		}
		this.itemContainerLayoutList[index] = itemContainerLayout
		let fullLoadItemContainerLayout = true
		this.itemContainerLayoutList.map((item, index) => {
			if (!item) {
				fullLoadItemContainerLayout = false
			}
		})
		if (fullLoadItemContainerLayout) {
			this.forceUpdate()
		}
	}

	_findFixCursorWidth = () => {
		return this.props?.cursorStyle?.width
	}

	_reloadPageIndexValue = (isWidth) => {
		let fixCursorWidth = this._findFixCursorWidth()
		let rangeList = (isIndex) => {
			let itemList = [isIndex ? -1 : 0]
			itemList = itemList.concat(this.itemContainerLayoutList.map((item, index) => {
				if (isIndex) {
					return index
				} else {
					if (item) {
						if (fixCursorWidth) {
							return isWidth ? fixCursorWidth : (item.x + (item.width - fixCursorWidth) / 2.0)
						} else {
							return isWidth ? item.width : (item.x + (item.width) / 2.0)
						}
					} else {
						return 0
					}
				}
			}))
			itemList = itemList.concat([isIndex ? itemList.length - 1 : 0])
			return itemList
		}
		return this.props.scrollPageIndexValue.interpolate({
			inputRange: rangeList(true),
			outputRange: rangeList(false),
		})
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.data != this.props.data) {
			this.itemContainerLayoutList = nextProps.data.map(item => false)
			return true
		}
		return false
	}

	render() {
		let fixCursorWidth = this._findFixCursorWidth()
		let translateX = this._reloadPageIndexValue(false)
		let scaleX = this._reloadPageIndexValue(true)
		let containerStyle = {
			transform: [ 
				{ translateX }, 
				fixCursorWidth ? { scale: 1 } : { scaleX } 
			], 
			width: fixCursorWidth ?? 1,
			position: 'absolute', top: 0, bottom: 0, left: 0, 
			alignItems: 'center'
		}
		let contentStyle = [
			this.props.cursorStyle,
			{ width: fixCursorWidth ?? 1 }
		]
		return (
			<View pointerEvents={'none'} style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
				<Animated.View style={containerStyle}>
				{
					this.props.renderCursor ? this.props.renderCursor() : <View style={contentStyle}></View>
				}
				</Animated.View>
			</View>
		)
	}

}