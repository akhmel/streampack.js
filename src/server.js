import React from 'react';
import { renderToString } from 'react-dom/server';
import StreampackConnection from './connection';

const WebSocket = require('ws');

export default function StreampackServer (httpServer, app) {
  console.log('hello from StreampackServer');

  // TODO: verify client
  new WebSocket.Server({server: httpServer}).on('connection', (wsc) => {
    console.log('new client connected');
    const appConn = new StreampackConnection(app);

    wsc.on('close', () => {
      console.log('stopping client');
    });

    wsc.on('message', (data) => {
      const event = JSON.parse(data);
      appConn.renderOnEvent(event, (res) => {
        // console.log('processed event!');
        // console.log(JSON.stringify(appConn.appState()));
        // console.log(res);
        wsc.send(res);
      });
    });

    wsc.on('error', (err) => console.log('errored: ' + JSON.stringify(err)));
  });
}
