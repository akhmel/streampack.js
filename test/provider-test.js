import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import StreampackProvider from '../src/components/StreampackProvider';

class WrappingExample extends React.Component {
  render() {
    const { _childIndex } = this.props;
    return <div>
      <h1>cool stuff here {_childIndex}</h1>
      {this.props.children}
    </div>;
  }
}

class Simple extends React.Component {
  render() {
    const { _childIndex } = this.props;
    return <div>simple {_childIndex}</div>;
  }
}

describe('StreampackProvider', () => {
  it('adds childIndex to component props (one child component)', () => {
    const wrapper = mount(<StreampackProvider><Simple /></StreampackProvider>);
    expect(wrapper.html()).to.equal('<div>simple 1</div>');
  });

  it('adds childIndex to component props (two children)', () => {
    const wrapper = mount(<StreampackProvider>
      <div>
        <Simple key='one'/>
        <Simple key='two'/>
      </div>
    </StreampackProvider>);
    expect(wrapper.html()).to.equal('<div><div>simple 2</div><div>simple 3</div></div>');
  });

  it('adds childIndex to component props (wrapper case)', () => {
    const wrapper = mount(<StreampackProvider>
      <div>
        <WrappingExample>
          <Simple key='one'/>
          <Simple key='two'/>
        </WrappingExample>
      </div>
    </StreampackProvider>);
    expect(wrapper.html()).to.equal('<div><div><h1>cool stuff here 2</h1><div>simple 3</div><div>simple 4</div></div></div>');
  });
});
