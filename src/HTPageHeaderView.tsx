import React, { Component, RefObject } from 'react';
import { View, StyleSheet, Pressable, ScrollView, ScrollViewProps, Animated, Easing, PixelRatio } from 'react-native';
import HTSelectedLabel from './HTSelectedLabel';
import HTPageHeaderCursor from './HTPageHeaderCursor';

interface HTPageHeaderViewProps extends ScrollViewProps {
  data: any[];
  itemContainerStyle?: object;
  initialScrollIndex?: number;
  renderItem?: (item: any, index: number, titleStyle: object) => React.ReactNode;
  titleFromItem?: (item: any, index: number) => string;
  itemTitleStyle?: object;
  itemTitleNormalStyle?: object;
  itemTitleSelectedStyle?: object;
  cursorStyle?: object;
  renderCursor?: () => React.ReactElement | null;
  onSelectedPageIndex?: (index: number) => void;
  selectedPageIndexDuration?: number;
  shouldSelectedPageIndex?: () => boolean;
  scrollContainerStyle?: object;
  contentContainerStyle?: object;
  containerStyle?: object;
}

export default class HTPageHeaderView extends Component<HTPageHeaderViewProps> {
  private scrollPageIndex = this.props.initialScrollIndex ?? 0;
  private scrollPageIndexValue = new Animated.Value(this.scrollPageIndex);
  private nextScrollPageIndex = -1;
  private shouldHandlerAnimationValue = true;
  private itemConfigList = this.props.data.map((item) => ({
    _animtedEnabledValue: new Animated.Value(1),
  }));
  private itemContainerStyle = { height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...this.props.itemContainerStyle } as { flex?: number } & object;
  private itemTitleNormalStyle: { fontSize: number, color: string } & object = {
    fontSize: 16,
    color: '#333',
    ...this.props.itemTitleStyle,
    ...this.props.itemTitleNormalStyle,
  };
  private itemTitleSelectedStyle: { fontSize: number, color: string } & object = {
    ...this.itemTitleNormalStyle,
    fontSize: 20,
    color: '#666',
    ...this.props.itemTitleSelectedStyle,
  };
  private cursorStyle = {
    position: 'absolute',
    bottom: 0,
    // width: '50%',
    height: 1 / PixelRatio.get(),
    backgroundColor: '#999',
    ...this.props.cursorStyle,
  };
  private cursor: RefObject<HTPageHeaderCursor> = React.createRef();

  static defaultProps: HTPageHeaderViewProps = {
    data: [],
		horizontal: true,
    selectedPageIndexDuration: 250,
		showsHorizontalScrollIndicator: false,
		showsVerticalScrollIndicator: false,
		contentInsetAdjustmentBehavior: 'never',
		automaticallyAdjustContentInsets: false,
		bounces: false,
	}

  public bindScrollPageIndexValue = (scrollPageIndexValue: Animated.Value) => {
    this.scrollPageIndexValue.removeAllListeners();
    this.scrollPageIndexValue = scrollPageIndexValue;
    this.shouldHandlerAnimationValue = false;
    this.addScrollPageIndexListener();
    this.forceUpdate();
  };

  private addScrollPageIndexListener = () => {
    this.scrollPageIndexValue.addListener(({ value }) => {
      if (this.nextScrollPageIndex === value) {
        this.itemConfigList.map((item, _index) => {
          item._animtedEnabledValue.setValue(1);
        });
      }
      this.scrollPageIndex = value;
    });
  };

  constructor(props: HTPageHeaderViewProps) {
    super(props)
    this.addScrollPageIndexListener()
  }

  override componentWillUnmount() {
    this.scrollPageIndexValue.removeAllListeners();
  }

  private _animation = (key: Animated.Value, value: number, duration: number = 0, native: boolean = true) => {
    Animated.timing(key, {
      toValue: value,
      duration: duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: native,
    }).start();
  };

  private _itemTitleProps = (item: any, index: number) => {
    let fontScale = 1 + (this.itemTitleSelectedStyle.fontSize - this.itemTitleNormalStyle.fontSize) / this.itemTitleNormalStyle.fontSize;
    if (fontScale === 1) {
      fontScale = 1.0001;
    }
    let scale = this.scrollPageIndexValue.interpolate({
      inputRange: [index - 2, index - 1, index, index + 1, index + 2],
      outputRange: [1, 1, fontScale, 1, 1],
    });
    const enabled = this.itemConfigList[index]._animtedEnabledValue;
    scale = Animated.add(Animated.multiply(scale, enabled), Animated.multiply(1, Animated.subtract(1, enabled)));
    const normalColor = this.itemTitleNormalStyle.color;
    const selectedColor = this.itemTitleSelectedStyle.color;
    return {
      ...this.itemTitleNormalStyle,
      normalColor,
      selectedColor,
      selectedScale: fontScale,
      text: this.props.titleFromItem ? this.props.titleFromItem(item, index) : item,
      style: {
        ...this.itemTitleNormalStyle,
        transform: [{ scale }],
      },
    };
  };

  private _renderTitle = (item: any, index: number) => {
    return <HTSelectedLabel {...this._itemTitleProps(item, index)} />;
  };

  private _itemDidTouch = (item: any, index: number) => {
    if (this.props.shouldSelectedPageIndex) {
      let result = this.props.shouldSelectedPageIndex();
      if (result === false) {
        return;
      }
    }
    this.nextScrollPageIndex = index;
    this.itemConfigList.map((item, _index) => {
      item._animtedEnabledValue.setValue(_index === index || _index === this.scrollPageIndex ? 1 : 0);
    });
    if (this.shouldHandlerAnimationValue) {
      this._animation(this.scrollPageIndexValue, index, this.props.selectedPageIndexDuration, true);
    }
    this.props.onSelectedPageIndex?.(index);
  };

  private _renderItem = (item: any, index: number) => {
    let content =
      this.props.renderItem != null
        ? this.props.renderItem(item, index, this._itemTitleProps(item, index))
        : this._renderTitle(item, index);
    return (
      <Pressable key={index} style={this.itemContainerStyle} onLayout={(event) => this?.cursor?.current?.onLayoutItemContainer(event, item, index)} onPress={() => this._itemDidTouch(item, index)}>
        {content}
      </Pressable>
    );
  };

  private _renderCursor = () => {
    return (
      <HTPageHeaderCursor
        ref={this.cursor}
        data={this.props.data}
        scrollPageIndexValue={this.scrollPageIndexValue}
        renderCursor={this.props.renderCursor}
        cursorStyle={this.cursorStyle}
      />
    );
  };

  override shouldComponentUpdate(nextProps: HTPageHeaderViewProps) {
	if (nextProps.data !== this.props.data) {
		this.itemConfigList = nextProps.data.map((item) => ({
			_animtedEnabledValue: new Animated.Value(1),
		}));
		return true;
		}
		return false;
	}

	override render() {
		return (
      <View style={this.props.style}>
        <ScrollView
        {...this.props}
        contentContainerStyle={[
          { width: this.itemContainerStyle?.flex ? '100%' : null },
          this.props.scrollContainerStyle,
        ]}
        >
        <View style={[StyleSheet.absoluteFill, this.props.containerStyle]}></View>
        <View style={[{ minWidth: '100%', flexDirection: 'row', alignItems: 'center' }, this.props.contentContainerStyle]}>
          {this._renderCursor()}
          {this.props.data?.map((item, index) => {
          return this._renderItem(item, index);
          })}
        </View>
        </ScrollView>
      </View>
		);
	}
}
