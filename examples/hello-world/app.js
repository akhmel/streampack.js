import express from 'express';

// this is WebSocket related
const server = require('http').createServer();

// this is react app related
import React from 'react';
import { StreampackComponent, enrichWithStreampack, StreampackServer } from '../../src'
import { renderToString, renderToStaticMarkup } from 'react-dom/server';


class ExampleButton extends StreampackComponent(React) {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
  }

  buttonClickHandler() {
    console.log('HEEY FROM SUBBUTTON');
    this.setState({clicked: true});
  }
  renderWithStreampack() {
    const { clicked } = this.state;
    let result;
    if (clicked) {
      result = <h3>you just clicked another button</h3>
    } else {
      result = <div><button onClick={this.buttonClickHandler.bind(this)}>hey this is button from another component</button></div>
    }
    return result;
  }
}


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
  }
  renderWithStreampack() {
    const { hello } = this.state;
    if (hello === 'yo!') {
      return <div>
        <h1 onClick={this.titleClickHandler.bind(this)}>Hello!</h1>
        <h2>button was clicked! thank you</h2><br/>
        <ExampleButton/>
        <div>Powered by:</div>
        <div>Streampack</div>
      </div>;
    } else {
      return <div>
        <h1 onClick={this.titleClickHandler.bind(this)}>Hello!</h1>
        <button onClick={this.buttonClickHandler.bind(this)}>click me</button>
      </div>;
    }
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
