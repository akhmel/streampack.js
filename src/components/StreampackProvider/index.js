import React from 'react';

export default class StreampackProvider extends React.Component {
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
      return React.cloneElement(ch, { _childIndex: i, children: subchld });
    }
    return React.cloneElement(ch, { children: subchld });
  }

  render() {
    const index = 0;
    return this.recursiveChildIndex(this.props.children, index);
  }
}
