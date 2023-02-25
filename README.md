## react-native-selected-page
react-native-selected-page is a lightweight react-native tab menu library, It supports animated fading and font scaling, and it uses native animations and gestures, so it can give you the best performance experience as native apps

<img src="./example/1.gif" width="300">

## Features

- [x] Support label animation fading and font scaling, making user operations smoother
- [x] Supports progress bars that follow animation and size adaptation
- [x] Support independent use, you can use Header alone, or float Header, or animation fading Label
- [x] Supports high customization

## Install

```bash
yarn add 'https://github.com/hellohublot/react-native-selected-page.git'
```

## Usage

[View Full Example](./example/App.js)

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

## Contact

hellohublot, hublot@aliyun.com
