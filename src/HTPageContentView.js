import React, { Component } from 'react'
import { View, Animated, Dimensions } from 'react-native'
import HTContentFlatList from './HTContentFlatList'
import PropTypes from 'prop-types'

const SCREEN_WIDTH = Dimensions.get('window').width

export default class HTPagContentView extends Component {

	static propTypes = {
		data: PropTypes.array,
		renderItem: PropTypes.func,
        selectedPageIndexDuration: PropTypes.boolean,
	}

	static defaultProps = {
		horizontal: true,
		scrollEventThrottle: 1 / 60.0 * 1000,
		initialNumToRender: 1,
		showsHorizontalScrollIndicator: false,
		showsVerticalScrollIndicator: false,
		contentInsetAdjustmentBehavior: 'never',
		automaticallyAdjustContentInsets: false,
		bounces: false,
		pagingEnabled: true,
        shouldSelectedPageAnimation: true,
		keyExtractor: (item, index) => index
	}

	constructor(props) {
        super(props)
        this.state = {
            scrollViewWidth: SCREEN_WIDTH
        }
        this._scrollViewWidthValue = new Animated.Value(SCREEN_WIDTH)

        let initialScrollIndex = this.props.initialScrollIndex ?? 0
        this._contentOffsetValueX = new Animated.Value(initialScrollIndex * this.state.scrollViewWidth)
        this._scrollPageIndexValue = Animated.divide(this._contentOffsetValueX, this._scrollViewWidthValue)
        this.event = Animated.event([{
            nativeEvent: {
                contentOffset: { x: this._contentOffsetValueX },
                layoutMeasurement: { width: this._scrollViewWidthValue }
            }
        }], {
            useNativeDriver: true
        })
    }

    componentDidMount() {
        this.props.onInitScrollPageIndexValue && this.props.onInitScrollPageIndexValue(this._scrollPageIndexValue)
    }

    scrollPageIndex = (pageIndex, animated = this.props.shouldSelectedPageAnimation) => {
        try {
            let scrollConfig = { index: pageIndex, animated: animated }
            this?.scrollView?.scrollToIndex && this?.scrollView?.scrollToIndex(scrollConfig)
        } catch(e) {
        }
    }

    _onLayout = ({ nativeEvent: { layout: { width } } }) => {
        if (width != this.state.scrollViewWidth && width > 0) {
            this._scrollViewWidthValue.setValue(width)
            this.setState({ scrollViewWidth: width }, () => {
                // only for web platform
                this.scrollView.reloadScrollContainerWidth && this.scrollView.reloadScrollContainerWidth()
            })
        }
    }
	

	_renderItem = (item, index, useViewPager = false) => {
		return (
			<View style={{ width: this.state.scrollViewWidth, height: '100%' }}>
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
			<HTContentFlatList
				{...this.props}
                onLayout={this._onLayout}
				ref={ref => {
					this._ref(ref)
					this.props.scrollViewRef && this.props.scrollViewRef(ref)
				}}

				style={{ width: '100%', ...this?.props?.style }}
				renderItem={({item, index}) => this._renderItem(item, index)}
				onScroll={this.event}
				getItemLayout={(item, index) => ({
					length: this.state.scrollViewWidth,
					offset: index * this.state.scrollViewWidth,
					index
				})}
                scrollViewWidth={this.state.scrollViewWidth}
			/>
		)
	}

}