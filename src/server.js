import React from 'react';
import { renderToString } from 'react-dom/server';

import StreampackProvider from './components/StreampackProvider';

const WebSocket = require('ws');

export default function StreampackServer (httpServer, app) {
  console.log('hello from StreampackServer');
  new WebSocket.Server({server: httpServer}).on('connection', (connection) => {
    console.log('new client connected');

    // TODO: respond with appState to client
    let appState = {};

    const setStateHandler = (statePayload) => {
      if (Object.keys(appState).length > 0) {
        Object.keys(appState).forEach((k)=> {
          if (statePayload[k]) {
            appState[k] = Object.assign(appState[k], statePayload[k]);
          }
        })
      } else {
        appState = Object.assign(appState, statePayload);
      }

      renderToString(
        <StreampackProvider statePayload={appState} onSetState={setStateHandler}>
          {app}
        </StreampackProvider>
      );
    }

    connection.on('close', () => {
      console.log('stopping client');
    });

    connection.on('message', (data) => {
      const event = JSON.parse(data);
      renderToString(
        <StreampackProvider event={event} statePayload={appState} onSetState={setStateHandler}>
          {app}
        </StreampackProvider>
      );
    });

    connection.on('error', (err) => console.log('errored: ' + JSON.stringify(err)));
  });
}
