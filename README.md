# React Native Selected Page

English | [中文](./README-cn.md)

A **high-performance, highly customizable** React Native tab/page component with smooth animations and flexible styling options. Built with `react-native-reanimated` for native performance.

## ✨ Features

- 🚀 **High Performance**: Smooth animations even with heavy computations in pages
- 🎨 **Highly Customizable**: Separate Header and Page components with full control
- 🔧 **Flexible Indicator**: Custom indicator animations and styling
- 📱 **Native Feel**: Uses `react-native-reanimated` for 60fps animations
- 🎯 **TypeScript Support**: Full TypeScript support with type definitions
- 🔄 **Gesture Support**: Smooth pan gestures and scroll interactions
- 💎 **Clean API**: Simple and intuitive component structure

## 🚀 Demo

Try the live demo on Snack Expo: **[https://snack.expo.dev/@hublot/react-native-selected-page](https://snack.expo.dev/@hublot/react-native-selected-page)**

## 📦 Installation

```bash
yarn add react-native-selected-page@https://github.com/hellohublot/react-native-selected-page.git
```

## 🎯 Basic Usage

<img src="./1.gif" width="300" alt="Basic Usage">

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Tab } from 'react-native-selected-page';

const PAGES = [
  { title: 'Home', backgroundColor: 'skyblue' },
  { title: 'Profile', backgroundColor: 'coral' },
  { title: 'Settings', backgroundColor: 'pink' },
];

export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: 80 }}>
      <Tab data={PAGES}>
        <Tab.Header 
          itemNormalStyle={{ paddingHorizontal: 10, fontSize: 18 }}
          indicatorWidth={0.5}
        />
        <Tab.Page
          renderItem={({ item }) => (
            <View style={{ flex: 1, backgroundColor: item.backgroundColor }}>
            </View>
          )}
        />
      </Tab>
    </View>
  );
}
```

## 🎨 Advanced Customization

<img src="./2.gif" width="300" alt="Advanced Customization">

```tsx
import MaskedView from '@react-native-masked-view/masked-view'

function Page({item}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: item.backgroundColor,
      }}
    >
    </View>
  )
}

function CustomHeader() {
  const { scrollX, headerItemLayouts, pageWidth, data } = React.useContext(TabContext);
  const indicatorWidth = 1
  const createStyle = (isMask) => {
    return useAnimatedStyle(() => {
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

      const style = {
        position: 'absolute',
        bottom: 0,
        left,
        width: right - left,
      }

      return isMask ? {
        ...style,
        top: 0,
        backgroundColor: 'white'
      } : {
        ...style,
        top: 9,
        height: 40, 
        borderRadius: 20, 
        backgroundColor: 'orange'
      }
    })
  }
  const maskStyle = createStyle(true)
  const indicatorStyle = createStyle(false)
  return (
    <Tab.Header 
      style={{ backgroundColor: 'white' }}
      itemNormalStyle={{ color: 'turquoise', paddingHorizontal: 10, fontSize: 15 }}
      renderIndicator={() => null}
      renderList={(value) => (
        <>
          { value }
          <Animated.View pointerEvents="none" style={indicatorStyle} />
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <MaskedView pointerEvents="none" style={[StyleSheet.absoluteFill, {flexDirection: 'row', backgroundColor: 'transparent' }]} maskElement={(
              <View pointerEvents="none" style={[StyleSheet.absoluteFill, { flexDirection: 'row', backgroundColor: 'transparent', paddingHorizontal: 10 }]}>
                {value}
              </View>
            )}>
              <Animated.View pointerEvents="none" style={maskStyle} />
            </MaskedView>
          </View>
        </>
      )}
    />
  )
}


export default function AdvancedApp() {
  return (
    <View style={{ flex: 1, paddingTop: 80 }}>
      <Tab data={PAGES}>
        <CustomHeader />
        <Tab data={PAGES}>
          <CustomHeader />
          <Tab.Page
            windowSize={2}
            renderItem={({ item }) => (
              <Page item={item} />
            )}
          />
        </Tab>
      </Tab>
    </View>
  );
}
```

## 🔥 High Performance Demo

Even with heavy computations in page components, animations remain smooth:

```tsx
function HighPerformancePage({ item }) {
  // Intensive computation that would normally block UI
  for (let i = 0; i < 50000000; i++) {
    i += 1;
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: item.backgroundColor }}>
      <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 50 }}>
        🚀 Smooth Animation Even With Heavy Computation!
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 20 }}>
        This page ran 50 million iterations but animations stay fluid
      </Text>
    </View>
  );
}

// Usage
<Tab.Page
  renderItem={({ item }) => <HighPerformancePage item={item} />}
/>
```

## 📖 API Reference

### Tab Component

| Prop | Type | Description |
|------|------|-------------|
| `data` | `Array<any>` | Array of page data objects |
| `children` | `React.ReactNode` | Tab.Header and Tab.Page components |

### Tab.Header Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `indicatorWidth` | `number` | `1` | Width of indicator (0-1 for percentage, >1 for fixed width) |
| `itemNormalStyle` | `TextStyle` | `{}` | Style for normal tab items |
| `itemSelectedStyle` | `TextStyle` | `{}` | Style for selected tab items |
| `indicatorStyle` | `ViewStyle` | `{}` | Style for the indicator |
| `renderItem` | `Function` | `undefined` | Custom render function for tab items |
| `renderIndicator` | `Function` | `undefined` | Custom render function for indicator |
| `style` | `ViewStyle` | `{}` | Style for the header container |

### Tab.Page Component

| Prop | Type | Description |
|------|------|-------------|
| `renderItem` | `Function` | Function to render each page |
| `...FlatListProps` | `any` | All FlatList props are supported |

## 🎭 Customization Examples

### Custom Indicator

```tsx
<Tab.Header
  renderIndicator={({ scrollX, headerItemLayouts }) => (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          height: 3,
          backgroundColor: 'orange',
          borderRadius: 1.5,
        },
        // Add your custom animation logic here
      ]}
    />
  )}
/>
```

### Separated Header and Page

```tsx
<View style={{ flex: 1 }}>
  <Tab data={PAGES}>
    <Tab.Header />
  </Tab>
  
  {/* Custom content in between */}
  <View style={{ height: 50, backgroundColor: '#f0f0f0' }} />
  
  <Tab data={PAGES}>
    <Tab.Page renderItem={({ item }) => <YourPage item={item} />} />
  </Tab>
</View>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**hellohublot** - [hellohublot@gmail.com](mailto:hellohublot@gmail.com)

---