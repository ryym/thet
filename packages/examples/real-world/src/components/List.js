import React, { Component } from 'react';

export default class List extends Component {
  // static propTypes = {
  //   loadingLabel: PropTypes.string.isRequired,
  //   pageCount: PropTypes.number,
  //   renderItem: PropTypes.func.isRequired,
  //   items: PropTypes.array.isRequired,
  //   isFetching: PropTypes.bool.isRequired,
  //   onLoadMoreClick: PropTypes.func.isRequired,
  //   nextPageUrl: PropTypes.string
  // }

  static defaultProps = {
    isFetching: true,
    loadingLabel: 'Loading...',
  }

  renderLoadMore() {
    const { isFetching, onLoadMoreClick } = this.props;
    return (
      <button
        style={{ fontSize: '150%' }}
        onClick={onLoadMoreClick}
        disabled={isFetching}
      >
        {isFetching ? 'Loading...' : 'Load More'}
      </button>
    );
  }

  render() {
    const {
      isFetching, nextPageUrl,
      items, renderItem, loadingLabel,
    } = this.props;

    if (items.length === 0) {
      if (isFetching) {
        return <h2><i>{loadingLabel}</i></h2>;
      }
      if (!nextPageUrl) {
        return <h1><i>Nothing here!</i></h1>;
      }
    }

    return (
      <div>
        {items.map(renderItem)}
        {nextPageUrl && this.renderLoadMore()}
      </div>
    );
  }
}
