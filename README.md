## Features

- The pure native animation navigation bar, text size change, text color change and separator scroll bar both are Animated.Value + Animated.Event native animations
- Can be used separately, such as Header and Content and SelectedLabel can be used separately
- Each header.item can be customized

<img src="./example/1.gif" width="300">

## Usage

[Example](./example/App.js)

```bash
yarn add 'https://github.com/hellohublot/react-native-selected-page.git'
```

```javascript
import { HTPageHeaderView, HTPageContentView, HTPageManager, HTSelectedLabel } from 'react-native-selected-page'

this.pageManager = new HTPageManager([
	{ title: 'hello', backgroundColor: 'skyblue' },
	{ title: 'world', backgroundColor: 'coral' },
	{ title: 'ride bike', backgroundColor: 'pink' },
	{ title: 'sunbathing', backgroundColor: 'turquoise' },
	{ title: 'drink', backgroundColor: 'salmon' },
])

let Header = this.pageManager.renderHeaderView
let Content = this.pageManager.renderContentView

<Header 
	style={{ height: 50, backgroundColor: 'white', borderBottomColor: '#F5F5F5', borderBottomWidth: 1 }}
	titleFromItem={ item => item.title }
	initScrollIndex={ 0 }
	itemContainerStyle={{ paddingHorizontal: 10, marginLeft: 10 }}
	itemTitleStyle={{ fontSize: 17 }}
	itemTitleNormalStyle={{ color: '#333' }}
	itemTitleSelectedStyle= {{ color: 'orange', fontSize: 20}}
	cursorStyle={{ width: 15, height: 2, borderRadius: 1, backgroundColor: 'orange' }}
/>
<Content 
	initScrollIndex={ 0 }
	renderItem={({item, index}) => {
	return (
		<View style={{ flex: 1, backgroundColor: item.backgroundColor }}>
		</View>
	)}} 
/>

```

## Author

hellohublot, hublot@aliyun.com
