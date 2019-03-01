const socketIo = require("socket.io");
const http = require("http");
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
    // bring dispatcher only if websocket connection was established successfully.
    const Dispatcher = require("./dispatcher")(client);

    client.on('request', (args) => {
        Dispatcher.dispatch(args.action,args.payload);
    })

});

server.listen(port, () => console.log(`Listening on port ${port}`));


