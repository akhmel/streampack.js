import React from 'react';
import StreampackProvider from './components/StreampackProvider';

export default function enrichWithStreampack (app) {
  return <StreampackProvider>{app}</StreampackProvider>;
}
