import express from 'express';

// this is WebSocket related
const server = require('http').createServer();

// this is react app related
import React from 'react';
import { StreampackComponent, enrichWithStreampack, StreampackServer } from '../../src'
import { renderToString, renderToStaticMarkup } from 'react-dom/server';


class HelloWorld extends StreampackComponent(React) {
  constructor(props) {
    super(props);
    this.state = {test: 'wow'};
  }

  buttonClickHandler() {
    console.log('hello from button');
    this.setState({hello: 'yo!'});
  }
  titleClickHandler() {
    console.log('clicked title!!!!');
    this.setState({test: 'niiicee'});
  }
  renderWithStreampack() {
    console.log(JSON.stringify(this.state));
    return <div>
      <h1 onClick={this.titleClickHandler.bind(this)}>Hello!</h1>
      <button onClick={this.buttonClickHandler.bind(this)}>click me</button>
    </div>;
  }
}

StreampackServer(server, <HelloWorld/>);

const app = express();
app.use(express.static('public'));
app.get('/', (req, res) => {
  const app = enrichWithStreampack(<HelloWorld/>);
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
