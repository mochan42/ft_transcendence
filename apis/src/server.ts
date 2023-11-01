const http = require('http').createServer();

const io = require('socket.io')(http, {
  cors: { origin: 'https://special-dollop-r6jj956gq9xf5r9-3000.app.github.dev' },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });
});

http.listen(8080, () => console.log('listening on http://localhost:8080'));
