import express from 'express';

// this is WebSocket related
const WebSocket = require('ws');
const server = require('http').createServer();
const wss = new WebSocket.Server({server: server});
wss.on('connection', (ws) => {
  const id = setInterval(() => {
    ws.send(JSON.stringify(process.memoryUsage()), () => { /* ignore errors */ });
  }, 100);
  console.log('started client interval');
  ws.on('close', () => {
    console.log('stopping client interval');
    clearInterval(id);
  });

  ws.on('message', (data) => {
    console.log('incoming message: ' + data);
  });

  ws.on('error', (err) => console.log('errored: ' + JSON.stringify(err)));
});


// this is react app related
import React from 'react';
import { StreampackComponent } from '../../src'
import { renderToString, renderToStaticMarkup } from 'react-dom/server';

// class StreampackProvider extends React.Component {
//   render() {
//     let index = 0;
//     return React.Children.map(this.props.children, child => {
//       console.log(child);
//       console.log(child.props.children);
//       return React.cloneElement(child, { 'data-spid': 'child-' + (index++) });
//     });
//   }
// }

class HelloWorld extends StreampackComponent(React) {
  componentWillMount() {
    console.log(this.refs.yo);
    // var element = ReactDOM.findDOMNode(this.refs.test);
    // element.setAttribute('custom-attribute', 'some value');
  }
  buttonClickHandler() {
    console.log('hello from button');
  }
  _render() {
    return <div ref='yo'>
      <h1>Hello!</h1>
      <button onClick={this.buttonClickHandler.bind(this)}>click me</button>
    </div>;
  }
}
const app = express();
app.use(express.static('public'));
app.get('/', (req, res) => {
  const app = <HelloWorld />;
  res.end('<!doctype html>' + renderToStaticMarkup(<html>
    <head>
      <script src='./snippet.js' />
    </head>
    <body dangerouslySetInnerHTML={{ __html: renderToString(app) }}></body>
  </html>));
});

server.on('request', app);
server.listen(8081, function () {
  console.log('Listening on http://localhost:8081');
});
