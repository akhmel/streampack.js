import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import StreampackConnection from '../src/connection';
import StreampackComponent from '../src/components/StreampackComponent';

describe('StreampackConnection', () => {
  it('appState', () => {
    const connection = new StreampackConnection();
    expect(connection.appState()).to.deep.equal({});
  });


  it('setState', () => {
    const connection = new StreampackConnection();
    expect(connection.appState()).to.deep.equal({});

    expect(connection.setState({hey: 'yo'})).to.deep.equal({hey: 'yo'});
    expect(connection.appState()).to.deep.equal({hey: 'yo'});

    expect(connection.setState({wow: 'cool'})).to.deep.equal({hey: 'yo', wow: 'cool'});
    expect(connection.appState()).to.deep.equal({hey: 'yo', wow: 'cool'});

    expect(connection.setState({tree: {one: 1, two: 2}})).to.deep.equal({
      hey: 'yo', tree: { one: 1, two: 2 }, wow: 'cool'
    });

    expect(connection.setState({tree: {three: 3}})).to.deep.equal({
      hey: 'yo', tree: { one: 1, two: 2, three: 3 }, wow: 'cool'
    });

    expect(connection.setState({tree: {one: 'one'}})).to.deep.equal({
      hey: 'yo', tree: { one: 'one', two: 2, three: 3 }, wow: 'cool'
    });

    expect(connection.setState({tree: 'lol'})).to.deep.equal({
      hey: 'yo', tree: 'lol', wow: 'cool'
    });
  });


  it('reloadState', () => {
    const connection = new StreampackConnection();
    expect(connection.appState()).to.deep.equal({});
    expect(connection.setState({foo: 'bar', lol: 'hey'})).to.deep.equal({foo: 'bar', lol: 'hey'});
    expect(connection.appState()).to.deep.equal({foo: 'bar', lol: 'hey'});

    expect(connection.reloadState({haha: 'new', zis: 'state'})).to.deep.equal({haha: 'new', zis: 'state'});
    expect(connection.appState()).to.deep.equal({haha: 'new', zis: 'state'});
  });
});
