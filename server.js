const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const TARGET = 'ws://YOUR.V2RAY.SERVER.IP:PORT'; // Change this

const server = http.createServer();

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(wsClient, req) {
  const proxy = new WebSocket(TARGET, {
    headers: {
      'X-Forwarded-For': req.socket.remoteAddress
    }
  });

  wsClient.on('message', (message) => {
    proxy.readyState === WebSocket.OPEN && proxy.send(message);
  });

  proxy.on('message', (message) => {
    wsClient.readyState === WebSocket.OPEN && wsClient.send(message);
  });

  proxy.on('close', () => wsClient.close());
  wsClient.on('close', () => proxy.close());

  proxy.on('error', () => wsClient.close());
  wsClient.on('error', () => proxy.close());
});

server.listen(PORT, () => {
  console.log(`WebSocket proxy running on port ${PORT}`);
});
