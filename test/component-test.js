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

class Combined extends StreampackComponent(React) {
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

class TwoLevels extends StreampackComponent(React) {
  renderWithStreampack() {
    return <div>
      <h1>hey</h1>
      <h2>yo</h2>
    </div>;
  }
}

class ThreeLevels extends StreampackComponent(React) {
  renderWithStreampack() {
    return <div>
      <h1>hey</h1>
      <div>
        <button>click!</button>
        <span>haha</span>
      </div>
    </div>;
  }
}

class FourLevels extends StreampackComponent(React) {
  renderWithStreampack() {
    return <div>
      <h1>hey</h1>
      <div>
        <div>
          <h1>Foo</h1>
          <h2>Bar</h2>
        </div>
      </div>
    </div>;
  }
}

describe('StreampackComponent', () => {
  it('adds spid (simple case)', () => {
    const wrapper = mount(<Simple streampack={{_childIndex: 100}}/>);
    const sidOccurence = (wrapper.html().match(/sid/g) || []).length
    expect(sidOccurence).to.equal(1);
    expect(wrapper.html()).to.equal('<div sid="baa-a">hey</div>');
  });

  it('adds spid (simple case with key)', () => {
    const wrapper = mount(<Simple streampack={{scope: 'smpl', _childIndex: 100}}/>);
    const sidOccurence = (wrapper.html().match(/sid/g) || []).length
    expect(sidOccurence).to.equal(1);
    expect(wrapper.html()).to.equal('<div sid="baa-a-smpl">hey</div>');
  });

  it('adds spid (two levels case)', () => {
    const wrapper = mount(<TwoLevels streampack={{_childIndex: 200}} />);
    const sidOccurence = (wrapper.html().match(/sid/g) || []).length
    expect(sidOccurence).to.equal(3);
    expect(wrapper.html()).to.equal('<div sid="caa-b"><h1 sid="caa-c">hey</h1><h2 sid="caa-d">yo</h2></div>');
  });

  it('adds spid (three levels case)', () => {
    const wrapper = mount(<ThreeLevels streampack={{_childIndex: 300}} />);
    const sidOccurence = (wrapper.html().match(/sid/g) || []).length
    expect(sidOccurence).to.equal(5);
    expect(wrapper.html()).to.equal('<div sid="daa-b"><h1 sid="daa-c">hey</h1><div sid="daa-d"><button sid="daa-e">click!</button><span sid="daa-f">haha</span></div></div>');
  });

  it('adds spid (four levels case)', () => {
    const wrapper = mount(<FourLevels streampack={{_childIndex: 400}} />);
    const sidOccurence = (wrapper.html().match(/sid/g) || []).length
    expect(sidOccurence).to.equal(6);
    expect(wrapper.html()).to.equal('<div sid="eaa-b"><h1 sid="eaa-c">hey</h1><div sid="eaa-d"><div sid="eaa-e"><h1 sid="eaa-f">Foo</h1><h2 sid="eaa-g">Bar</h2></div></div></div>');
  });

  it('adds spid (wrapped by Provider)', () => {
    const wrapper = mount(<StreampackProvider><FourLevels/></StreampackProvider>);
    const sidOccurence = (wrapper.html().match(/sid/g) || []).length
    expect(sidOccurence).to.equal(6);
    expect(wrapper.html()).to.equal('<div sid="b-b"><h1 sid="b-c">hey</h1><div sid="b-d"><div sid="b-e"><h1 sid="b-f">Foo</h1><h2 sid="b-g">Bar</h2></div></div></div>');
  });

  it('adds spid to Combined component (wrapped by Provider)', () => {
    const wrapper = mount(<StreampackProvider><Combined/></StreampackProvider>);
    // const sidOccurence = (wrapper.html().match(/sid/g) || []).length
    // expect(sidOccurence).to.equal(6);
    expect(wrapper.html()).to.equal('');
  });
});
