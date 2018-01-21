import React from 'react';
import PropTypes from 'prop-types';

const contextTypes = {
  streampack: PropTypes.shape({
    _newState: PropTypes.object,
    _onSetState: PropTypes.func,
    _event: PropTypes.object
  })
};

export default class StreampackProvider extends React.Component {
  static childContextTypes = contextTypes;
  constructor(props) {
    super(props);
    this.statePayload = this.props.statePayload;
    this.recursiveChildIndex = this.recursiveChildIndex.bind(this);
  }

  recursiveChildIndex(ch, i) {
    let subchld; i++;
    if (ch.props.children instanceof Array) {
      subchld = ch.props.children.map((el, elInd) => {
        return this.recursiveChildIndex(el, elInd+i);
      });
    } else if (ch.props.children instanceof Object) {
      subchld = this.recursiveChildIndex(ch.props.children, i);
    } else {
      subchld = ch.props.children;
    }
    if (ch.type instanceof Function) {
      return React.cloneElement(ch, {
        streampack: {
          _childIndex: i,
          _componentSid: 'a'
        },
        children: subchld
      });
    }
    return React.cloneElement(ch, {
      children: subchld
    });
  }

  getChildContext() {
    const { event, onSetState, statePayload } = this.props;
    return {
      streampack: {
        _appState: statePayload || {},
        _onSetState: onSetState,
        _event: event
      }
    };
  }

  render() {
    const index = 0;
    return this.recursiveChildIndex(this.props.children, index);
  }
}
