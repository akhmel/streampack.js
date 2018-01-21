import React from 'react';
import { renderToString } from 'react-dom/server';
import StreampackProvider from './components/StreampackProvider';

export default function StreampackConnection(app) {
  this._appState = {};
  this._app = app;

  this.appState = () => {
    return this._appState;
  }

  this.setState = (newState) => {
    if (Object.keys(newState).length > 0) {
      Object.keys(newState).forEach((k)=> {
        if (this._appState[k] instanceof Object && newState[k] instanceof Object) {
          this._appState[k] = Object.assign(this._appState[k], newState[k]);
        } else if (newState[k]) {
          this._appState[k] = newState[k];
        }
      });
    }
    return this._appState;
  }

  this.reloadState = (newState) => {
    this._appState = newState;
    return this._appState;
  }

  this._setStateHandler = (callback) => {
    return (statePayload) => {
      this.setState(statePayload);
      const result = renderToString(
        <StreampackProvider statePayload={this.appState()} onSetState={this._setStateHandler}>
          {this._app}
        </StreampackProvider>
      );
      callback(result);
    }
  }

  this.renderOnEvent = (event, callback) => {
    renderToString(
      <StreampackProvider event={event} statePayload={this.appState()} onSetState={this._setStateHandler(callback)}>
        {this._app}
      </StreampackProvider>
    );
  }

  this.render = (callback) => {
    renderToString(
      <StreampackProvider statePayload={this.appState()} onSetState={this._setStateHandler(callback)}>
        {this._app}
      </StreampackProvider>
    );
  }

}
