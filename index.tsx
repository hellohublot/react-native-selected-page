import React, {
  useState,
  useRef,
  useContext,
  createContext,
  useCallback,
} from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Dimensions,
  LayoutChangeEvent,
  FlatList,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';

const deviceWidth = Dimensions.get('window').width;

type Layout = { width: number; left: number };

export const TabContext = createContext<any>(null);

export function Tab({
  data,
  children,
}: {
  data: any[];
  children: React.ReactNode;
}) {
  const scrollX = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const [pageWidth, setPageWidth] = useState(deviceWidth);
  const pageScrollRef = useRef<FlatList>(null);
  const headerScrollRef = useRef<ScrollView>(null);
  const [headerItemLayouts, setHeaderItemLayouts] = useState<Layout[]>(
    data.map(() => ({ width: 0, left: 0 }))
  );

  return (
    <TabContext.Provider
      value={{ scrollX, currentIndex, headerScrollRef, pageScrollRef, pageWidth, data, setPageWidth, headerItemLayouts, setHeaderItemLayouts }}
    >
      {children}
    </TabContext.Provider>
  );
}

Tab.Header = function TabHeader({
  indicatorWidth = 1,
  renderIndicator,
  itemNormalStyle,
  itemSelectedStyle,
  indicatorStyle,
  renderItem,
  children,
  renderList,
  style,
  contentContainerStyle,
  ...scrollProps
}: {
  indicatorWidth: number;
  renderIndicator?: (info: {
    scrollX: any;
    current: number;
    next: number;
    headerItemLayouts: Layout[];
  }) => React.ReactNode;
  itemNormalStyle: any;
  itemSelectedStyle: any;
  indicatorStyle: any;
  renderItem?: (info: {
    item: any;
    index: number;
    scrollX: any;
    pageWidth: number;
    currentIndex: any;
  }) => React.ReactNode;
  renderList?: (value: React.ReactNode) => React.ReactNode;
  children?: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
} & React.ComponentProps<typeof ScrollView>) {
  const { headerScrollRef, scrollX, headerItemLayouts, setHeaderItemLayouts, pageScrollRef, currentIndex, pageWidth, data } = useContext(TabContext);

  const onLayoutItem = (index: number, e: LayoutChangeEvent) => {
    const { width, x } = e.nativeEvent.layout;
    setHeaderItemLayouts((prev) => {
      const copy = [...prev];
      copy[index] = { width, left: x };
      return copy;
    });
  };

  const onMenuPressAnimation = useCallback(
    (index: number) => {
      if (Math.abs(index - currentIndex.value) <= 1) {
        pageScrollRef.current.scrollToOffset({ offset: index * pageWidth, animated: true });
      } else {
        pageScrollRef.current.scrollToOffset({ offset: index * pageWidth, animated: false });
      }
    },
    [pageWidth, pageScrollRef, currentIndex.value]
  );

  const defaultIndicator = useCallback(() => {
    const style = useAnimatedStyle(() => {
      const pageProgress = Math.max(0, scrollX.value) / pageWidth;
      const currentPage = Math.floor(pageProgress);
      const nextPage = Math.min(currentPage + 1, data.length - 1);
      const progress = pageProgress - currentPage;

      const current = headerItemLayouts[currentPage];
      const next = headerItemLayouts[nextPage];

      const currentCenter = current.left + current.width / 2;
      const nextCenter = next.left + next.width / 2;

      let currentWidth, nextWidth;

      if (indicatorWidth <= 1) {
        currentWidth = current.width * indicatorWidth;
        nextWidth = next.width * indicatorWidth;
      } else {
        currentWidth = indicatorWidth;
        nextWidth = indicatorWidth;
      }

      const currentHalf = currentWidth / 2;
      const nextHalf = nextWidth / 2;

      let left, right;

      if (progress <= 0.5) {
        const rightStart = currentCenter + currentHalf;
        const rightEnd = nextCenter + nextHalf;
        right = rightStart + (rightEnd - rightStart) * (progress / 0.5);
        left = currentCenter - currentHalf;
      } else {
        const leftStart = currentCenter - currentHalf;
        const leftEnd = nextCenter - nextHalf;
        left = leftStart + (leftEnd - leftStart) * ((progress - 0.5) / 0.5);
        right = nextCenter + nextHalf;
      }

      return {
        position: 'absolute',
        bottom: 0,
        left,
        width: right - left,
        height: 3,
        backgroundColor: 'orange',
        borderRadius: 2,
      };
    });
    return (
      <Animated.View
        style={[style, indicatorStyle]}
      />
    );
  }, [data.length, pageWidth, scrollX.value, headerItemLayouts, indicatorWidth, indicatorStyle]);

  const renderItems = data.map((item, index) => {
    const animatedStyle = useAnimatedStyle(() => {
      const progress = interpolate(
        scrollX.value / pageWidth,
        [index - 1, index, index + 1],
        [0, 1, 0],
        'clamp'
      );
      const color = interpolateColor(progress, [0, 1], [itemNormalStyle?.color ?? '#666', itemSelectedStyle?.color ?? itemNormalStyle?.color ?? 'orange']);
      const scale = interpolate(progress, [0, 1], [itemNormalStyle?.transform?.find?.(x => x.scale)?.scale ?? 1, itemSelectedStyle?.transform?.find?.(x => x?.scale)?.scale ?? 1.2]);

      return {
        ...itemNormalStyle,
        ...(index == currentIndex.value ? { fontWeight: itemSelectedStyle?.fontWeight ?? '500' } : {}),
        color,
        transform: [...(itemNormalStyle?.transform ?? []), { scale }],
      };
    });

    return (
      <Pressable
        key={index}
        onPress={() => onMenuPressAnimation(index)}
        onLayout={(e) => onLayoutItem(index, e)}
        style={styles.menuContainer}
      >
        {renderItem ? (
          renderItem({
            item,
            index,
            scrollX,
            pageWidth,
            currentIndex
          })
        ) : (
          <Animated.Text style={[styles.menuText, animatedStyle]}>
            {item.title}
          </Animated.Text>
        )}
      </Pressable>
    );
  })

  return (
    <ScrollView
      ref={headerScrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      {...scrollProps}
      style={[{ height: 60, backgroundColor: 'white', flexGrow: 0 }, style]}
      contentContainerStyle={[
        { paddingHorizontal: 10 },
        contentContainerStyle,
      ]}
    >
      {children && (
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}
        >
          {children}
        </View>
      )}
        {renderList ? renderList(renderItems) : renderItems}
      {
        renderIndicator
        ? renderIndicator({
            scrollX,
            current: Math.floor(scrollX.value / pageWidth),
            next: Math.ceil(scrollX.value / pageWidth),
            headerItemLayouts,
          })
        : defaultIndicator()
        }
    </ScrollView>
  );
};

Tab.Page = function TabPage<T>({
  ...props
}: React.ComponentProps<typeof FlatList>) {
  const { data, headerItemLayouts, headerScrollRef, currentIndex, pageScrollRef, pageWidth, setPageWidth, scrollX } = useContext(TabContext);

  const scrollMenuToIndex = useCallback((index) => {
    if (
      headerScrollRef.current &&
      headerItemLayouts[index]?.width &&
      headerItemLayouts[index]?.left &&
      pageWidth
    ) {
      if (index == currentIndex.value) {
        return;
      }
      currentIndex.value = index;
      const { width: itemWidth, left: itemLeft } = headerItemLayouts[index];
      let scrollToX = itemLeft + itemWidth / 2 - pageWidth / 2;
      scrollToX = Math.max(0, scrollToX)
      headerScrollRef?.current?.scrollTo?.({ x: scrollToX, animated: true });
    }
  }, [headerItemLayouts, pageWidth, headerScrollRef, currentIndex]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
      const pageIndex = Math.round(e.contentOffset.x / pageWidth);
      runOnJS(scrollMenuToIndex)(pageIndex);
    },
  });

  return (
    <Animated.FlatList
      horizontal
      pagingEnabled
      bounces={false}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      data={data}
      keyExtractor={(_, i) => String(i)}
      {...props}
      renderItem={(info) => <View style={{ width: pageWidth }}>{}</View>}
      getItemLayout={(
        _,
        index,
      ) => ({length: pageWidth, offset: pageWidth * index, index})}
      onLayout={event => {
        setPageWidth(event.nativeEvent.layout.width)
        props?.onLayout?.(event)
      }}
      onScroll={scrollHandler}
      ref={pageScrollRef}
    />
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 16,
  },
});
