import React from 'react';

export default class StreampackProvider extends React.Component {
  constructor(props) {
    super(props);
    this._event = this.props.event;
    this._onSetState = this.props.onSetState;
    this.statePayload = this.props.statePayload;
    this.recursiveChildIndex = this.recursiveChildIndex.bind(this);
  }

  // TODO: consider element content, not only ind
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
        _newState: this.statePayload && this.statePayload[i],
        _childIndex: i,
        _onSetState: this._onSetState,
        _event: this._event,
        children: subchld
      });
    }
    return React.cloneElement(ch, { children: subchld });
  }

  render() {
    const index = 0;
    return this.recursiveChildIndex(this.props.children, index);
  }
}
