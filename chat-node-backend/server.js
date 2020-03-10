// server.js
const bodyParser = require('body-parser');
const cors = require('cors');

const app = require('express')();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// only use this for dev purposes
app.use(cors());

// Require user routes
require('./routes/user.routes.js')(app);

// Require message routes
require('./routes/message.routes.js')(app);

const server = require('http').Server(app);
const io = require('socket.io')(server);
const message = require('./controllers/message.controller.js');


// we will use port 8000 for our app
server.listen(8000, () => {
    console.log('connected to port 8000!');

    databaseConnection();

    socketConnection();
});


//databaseConnection
let databaseConnection = () => {
    // Configuring the database
    const config = require('./config/config.js');
    const mongoose = require('mongoose');

    mongoose.Promise = global.Promise;

    // Connecting to the database
    mongoose.connect(config.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });
}

//socketConnection
let socketConnection = () => {
    //Socket : For connction & sending msgs
    io.on('connection', socket => {
        // broadcast to everyone
        socket.on('send_msg_to_server', async (res) => {
            let latestMsg = await message.saveMessageToDb(res);
            if (res) {
                socket.emit('receive_msg_from_server', latestMsg);
                socket.broadcast.emit('receive_msg_from_server', latestMsg);
            }
        });

        // broadcast to everyone
        socket.on('like_dislike_msg', async (res) => {
            let messageObj = await message.likeDislikeMsg(res);

            if (messageObj) {
                socket.broadcast.emit('receive_likes_count_from_server', messageObj);
                socket.emit('receive_likes_count_from_server', messageObj);
            }
        });
    });
}
