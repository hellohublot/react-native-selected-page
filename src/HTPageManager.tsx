import React, { RefObject } from 'react';
import { Animated } from 'react-native';
import HTPageHeaderView from './HTPageHeaderView';
import HTPageContentView from './HTPageContentView';

interface HTPageManagerProps {
  data: any[];
  initialScrollIndex?: number;
  onSelectedPageIndex?: (pageIndex: number) => void;
}

export default class HTPageManager extends React.Component<HTPageManagerProps> {

  static defaultProps: HTPageManagerProps = {
    data: [],
    initialScrollIndex: 0,
    onSelectedPageIndex: () => {}
  }
  
  private headerView: RefObject<HTPageHeaderView> | null = React.createRef();
  private contentView: RefObject<HTPageContentView> | null = React.createRef();
  private pageIndex: number = -1;

  renderHeaderView = (props: any) => {
    return (
      <HTPageHeaderView
        ref={this.headerView}
        {...this.props}
        {...props}
        onSelectedPageIndex={(pageIndex: number) => {
          this?.contentView?.current?.scrollPageIndex(pageIndex);
          props?.onSelectedPageIndex && props.onSelectedPageIndex(pageIndex);
        }}
      />
    );
  };

  renderContentView = (props: any) => {
    return (
      <HTPageContentView
        ref={this.contentView}
        {...this.props}
        {...props}
        onInitScrollPageIndexValue={(scrollPageIndexValue) => {
          this?.headerView?.current?.bindScrollPageIndexValue(scrollPageIndexValue as Animated.Value);
          scrollPageIndexValue.addListener(({ value }) => {
            let willReloadPageIndex = Math.round(value);
            if (willReloadPageIndex !== this.pageIndex) {
              this.pageIndex = willReloadPageIndex;
              this.props.onSelectedPageIndex?.(this.pageIndex);
            }
          });
        }}
      />
    );
  };
}
