# streampack.js
Streampack is a solution for people, who want to get rid of heavy JavaScript bundles on the frontent.
At Blinkloader we think a lot about web performance. According to our observations, frontend JavaScript
is one of the biggest bottlenecks, that doesn't allow websites to load quickly.

Streampack allows to get rid of the frontend bundle by replacing it with a websocket connection.
All browser events are transmitted to the server, which responds with DOM tree transformations.

## Compatibility
Currently Streampack is built to work with React. Potentially we can enable support for Vue.js, jquery and angular.

