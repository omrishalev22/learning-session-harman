const socketIo = require("socket.io");
const http = require("http");
const Dispatcher = require("./dispatcher");
const port = 5000;

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

io.on('connection', (client) => {
    // listens to request, responses are sent back from dispatcher
    client.on('request', (args) => {
        const dispatcher = new Dispatcher(client);
        dispatcher.dispatch(args.action,args.payload);

    })
});

server.listen(port, () => console.log(`Listening on port ${port}`));


