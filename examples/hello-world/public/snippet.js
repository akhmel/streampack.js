document.addEventListener('DOMContentLoaded', function() {
  var host = window.document.location.host.replace(/:.*/, '');
  var ws = new WebSocket('ws://' + host + ':8081');

  ws.onopen = function () {
    ws.onmessage = function (event) {
      // updateStats(JSON.parse(event.data));
    };

    ['click','mouseover'].forEach(function(evName) {
      document.body.addEventListener(evName, function(ev) {
        var payload = { sid: ev.target.getAttribute('sid'), event: evName };
        console.log(payload);
        ws.send(JSON.stringify(payload), function (error) {});
      })
    })
  };
});
