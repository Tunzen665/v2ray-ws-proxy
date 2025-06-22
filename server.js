const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const TARGET = 'ws://3.1.83.100:80'; // Your backend V2Ray server

const server = http.createServer();

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(wsClient, req) {
  const proxy = new WebSocket(TARGET, {
    headers: {
      'X-Forwarded-For': req.socket.remoteAddress
    }
  });

  wsClient.on('message', (message) => {
    if (proxy.readyState === WebSocket.OPEN) proxy.send(message);
  });

  proxy.on('message', (message) => {
    if (wsClient.readyState === WebSocket.OPEN) wsClient.send(message);
  });

  proxy.on('close', () => wsClient.close());
  wsClient.on('close', () => proxy.close());

  proxy.on('error', () => wsClient.close());
  wsClient.on('error', () => proxy.close());
});

server.listen(PORT, () => {
  console.log(`WebSocket proxy listening on port ${PORT}`);
});
