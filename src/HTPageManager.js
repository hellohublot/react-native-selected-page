import React, { Component } from 'react'
import HTPageHeaderView from './HTPageHeaderView'
import HTPageContentView from './HTPageContentView'
import PropTypes from 'prop-types'

export default class HTPageManager {

    static propTypes = {
        data: PropTypes.array,
        initialScrollIndex: PropTypes.number,
        onSelectedPageIndex: PropTypes.func,
    }

    static defaultProps = {
        data: [],
        initialScrollIndex: 0,
        onSelectedPageIndex: () => {}
    }

    constructor(props) {
        this.props = props
    }

	renderHeaderView = (props) => {
		return (
			<HTPageHeaderView 
				ref={ref => this.headerView = ref}
				{...this.props}
				{...props}
				onSelectedPageIndex={(pageIndex) => {
                    // content.listener will call manager.props.onSelectedPageIndex
					this.contentView?.scrollPageIndex(pageIndex)
                    // call header.props.onSelectedPageIndex
                    props?.onSelectedPageIndex && props.onSelectedPageIndex(pageIndex)
				}}
			/>
		)
	}

	renderContentView = (props) => {
		return (
			<HTPageContentView 
				ref={ref => this.contentView = ref} 
				{...this.props}
				{...props}
				onInitScrollPageIndexValue={(scrollPageIndexValue) => {
					this.headerView && this.headerView.bindScrollPageIndexValue(scrollPageIndexValue)
					scrollPageIndexValue.addListener(({ value }) => {
						let willReloadPageIndex = Math.round(value)
						if (willReloadPageIndex != this.pageIndex) {
							this.pageIndex = willReloadPageIndex
                            // content.listener call manager.props.onSelectedPageIndex
							this.props.onSelectedPageIndex(this.pageIndex)
						}
					})
				}}
			/>
		)
	}

}