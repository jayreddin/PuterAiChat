const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World from basic HTTP server!');
});

const port = 5000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Basic HTTP server running on port ${port}`);
});