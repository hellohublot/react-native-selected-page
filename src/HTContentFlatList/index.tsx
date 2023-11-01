import React, { Component, RefObject } from 'react';
import {
  Animated,
  PanResponder,
  NativeSyntheticEvent,
  NativeScrollEvent,
  PanResponderGestureState,
  FlatListProps,
} from 'react-native';

export interface HTContentFlatListProps extends FlatListProps<any> {
  scrollViewWidth: number;
}

export default class HTContentFlatList extends Component<HTContentFlatListProps> {
  private pageIndex: number = 0;
  private isDraging: boolean = false;
  private hasScrolledToInitScrollIndex: boolean = false;
  private panResponder: ReturnType<typeof PanResponder.create>;
  private scrollView: RefObject<Animated.FlatList<any>> | null =
    React.createRef();

  constructor(props: HTContentFlatListProps) {
    super(props);
    const scrollEnabled = props.scrollEnabled ?? true;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => scrollEnabled,
      onShouldBlockNativeResponder: () => scrollEnabled,
      onMoveShouldSetPanResponder: () => scrollEnabled,
      onMoveShouldSetPanResponderCapture: () => scrollEnabled,
      onPanResponderGrant: (_, gestureState) =>
        this._onPanGestureStart(gestureState),
      onPanResponderMove: (_, gestureState) =>
        this._onPanGestureMove(gestureState),
      onPanResponderTerminate: (_, gestureState) =>
        this._onPanGestureEnd(gestureState),
      onPanResponderRelease: (_, gestureState) =>
        this._onPanGestureEnd(gestureState),
      onPanResponderTerminationRequest: () => true,
    });
  }

  private _onPanGestureStart = (gestureState: PanResponderGestureState) => {
    this.isDraging = true;
  };

  private _onPanGestureMove = (gestureState: PanResponderGestureState) => {
    this.scrollView?.current?.scrollToOffset({
      animated: false,
      offset: this.pageIndex * this.props.scrollViewWidth - gestureState.dx,
    });
  };

  private _onPanGestureEnd = (gestureState: PanResponderGestureState) => {
    const decelerationRate = 0.998;
    let decelerationDistance =
      (gestureState.vx * gestureState.vx) / (2 * (1 - 0.998));
    decelerationDistance *= gestureState.vx > 0 ? 1 : -1;
    const finallyDistance = decelerationDistance + gestureState.dx;
    const reloadPageIndex =
      Math.abs(finallyDistance) * 2 >= this.props.scrollViewWidth
        ? this.pageIndex + (finallyDistance > 0 ? -1 : 1)
        : this.pageIndex;
    this.scrollToIndex({
      animated: true,
      index: reloadPageIndex,
    });
    this.isDraging = false;
  };

  private _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.props.onScroll && this.props.onScroll(event);
    if (this.isDraging) {
      return;
    }
    const {
      nativeEvent: {
        contentOffset: { x },
      },
    } = event;
    this.pageIndex = Math.round(x / this.props.scrollViewWidth);
  };

  scrollToIndex = (config: { animated: boolean; index: number }) => {
    this.scrollView?.current?.scrollToIndex(config);
  };

  reloadScrollContainerWidth = (width: number) => {
    if (!this.hasScrolledToInitScrollIndex) {
      this.hasScrolledToInitScrollIndex = true;
      if ((this.props.initialScrollIndex ?? 0) != 0) {
        this.scrollToIndex({
          animated: false,
          index: this.props.initialScrollIndex ?? 0,
        });
      }
    } else {
      this.scrollToIndex({
        animated: false,
        index: this.pageIndex,
      });
    }
  };

  override render() {
    return (
      <Animated.FlatList
        {...this.props}
        {...this.panResponder.panHandlers}
        ref={this.scrollView}
        pagingEnabled={false}
        scrollEnabled={false}
        disableScrollViewPanResponder={true}
        onScroll={this._onScroll}
      />
    );
  }
}
