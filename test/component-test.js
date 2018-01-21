import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import StreampackComponent from '../src/components/StreampackComponent';
import StreampackProvider from '../src/components/StreampackProvider';

class Simple extends StreampackComponent(React) {
  renderWithStreampack() {
    return <div>hey</div>;
  }
}

class SeveralElements extends StreampackComponent(React) {
  renderWithStreampack() {
    return <div>hey<h1>title</h1><p>paragraph</p></div>;
  }
}

class PyramidCase extends StreampackComponent(React) {
  renderWithStreampack() {
    return <div><div><div>tada</div></div></div>;
  }
}

class SimpleInsideDiv extends StreampackComponent(React) {
  renderWithStreampack() {
    return <div><Simple/></div>;
  }
}

class TwoSimpleInsideDiv extends StreampackComponent(React) {
  renderWithStreampack() {
    return <div><Simple key='one'/><Simple key='two'/></div>;
  }
}

class SimpleInsideSimple extends StreampackComponent(React) {
  renderWithStreampack() {
    return <div>
      <SimpleInsideDiv key='one'/>
      <SimpleInsideDiv key='two'/>
    </div>;
  }
}

class CombinedOneLevel extends StreampackComponent(React) {
  renderWithStreampack() {
    return (
      <div>
        <div>combined</div>
        <Simple key='one'/>
        <Simple key='two'/>
      </div>
    )
  }
}

describe('StreampackComponent', () => {
  it('adds spid (simple case)', () => {
    const wrapper = mount(<StreampackProvider><Simple/></StreampackProvider>);
    const sidOccurence = (wrapper.html().match(/sid/g) || []).length
    expect(sidOccurence).to.equal(1);
    expect(wrapper.html()).to.equal('<div sid="a-a">hey</div>');
  });

  it('adds spid (SeveralElements case)', () => {
    const wrapper = mount(<StreampackProvider><SeveralElements/></StreampackProvider>);
    expect(wrapper.html()).to.equal('<div sid="a-a">hey<h1 sid="a-c">title</h1><p sid="a-d">paragraph</p></div>');
  });

  it('adds spid (PyramidCase)', () => {
    const wrapper = mount(<StreampackProvider><PyramidCase/></StreampackProvider>);
    expect(wrapper.html()).to.equal('<div sid="a-a"><div sid="a-b"><div sid="a-c">tada</div></div></div>');
  });

  it('adds spid (SimpleInsideDiv)', () => {
    const wrapper = mount(<StreampackProvider><SimpleInsideDiv/></StreampackProvider>);
    expect(wrapper.html()).to.equal('<div sid="a-a"><div sid="a#a-a">hey</div></div>');
  });

  it('adds spid (TwoSimpleInsideDiv)', () => {
    const wrapper = mount(<StreampackProvider><TwoSimpleInsideDiv/></StreampackProvider>);
    expect(wrapper.html()).to.equal('<div sid="a-a"><div sid="a#a-a">hey</div><div sid="a#b-a">hey</div></div>');
  });

  it('adds spid (SimpleInsideSimple)', () => {
    const wrapper = mount(<StreampackProvider><SimpleInsideSimple/></StreampackProvider>);
    expect(wrapper.html()).to.equal('<div sid="a-a"><div sid="a#a-a"><div sid="a#a#a-a">hey</div></div><div sid="a#b-a"><div sid="a#b#a-a">hey</div></div></div>');
  });
});
