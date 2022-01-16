import React, { Component } from 'react'
import HTPageHeaderView from './HTPageHeaderView'
import HTPageContentView from './HTPageContentView'

export default class HTPageManager {

	constructor(data, didSelectedPageIndex) {
		this.pageIndex = -1
		this.data = data
		this.didSelectedPageIndex = (pageIndex) => {
			didSelectedPageIndex && didSelectedPageIndex(pageIndex)
		}
	}

	_onSelectedPageIndex = (pageIndex, props) => {
		this.contentView?.scrollPageIndex(pageIndex)
		props?.onSelectedPageIndex && props.onSelectedPageIndex(pageIndex)
		// this.didSelectedPageIndex && this.didSelectedPageIndex(pageIndex)
	}

	renderHeaderView = (props) => {
		return (
			<HTPageHeaderView 
				ref={ref => this.headerView = ref}
				data={this.data}
				{...props}
				onSelectedPageIndex={(pageIndex) => {
					this._onSelectedPageIndex(pageIndex, props)
				}}
			/>
		)
	}

	renderContentView = (props) => {
		return (
			<HTPageContentView 
				ref={ref => this.contentView = ref} 
				data={this.data}
				{...props}
				onInitScrollPageIndexValue={(scrollPageIndexValue) => {
					this.headerView && this.headerView.bindScrollPageIndexValue(scrollPageIndexValue)
					scrollPageIndexValue.addListener(({ value }) => {
						let willReloadPageIndex = Math.round(value)
						if (willReloadPageIndex != this.pageIndex) {
							this.pageIndex = willReloadPageIndex
							this.didSelectedPageIndex(this.pageIndex)
						}
					})
				}}
			/>
		)
	}

}