// l'API de node pour max
const maxApi = require('max-api');
// to stream data ...
const fs = require('fs'); // file system class
const path = require('path'); // file path class

// in max :: script npm install express@4
// in max :: script npm install http

const express = require('express'); // class of the express librairie
const app = express(); // instance of the previous class
const http = require('http');
const server = http.createServer(app);
// https://socket.io/docs/v4/
const { Server } = require('socket.io');
const io = new Server(server);

var readStream;
var readStream2;
var chunks =[] , delay = 0 ;

app.get('/', (req,res) => {
    //res.send('<h1>This is my message !</h1>')
    res.sendFile(__dirname+"/the_index.html");
});

io.on('connection', (socket) => {
    maxApi.post("Hi new connection");
    // on connection read some data from a file
    readStream = "";
    //var readStream = fs.createReadStream('./data.txt'); // test stream with data
    //abstract-photography
    // abstract-image
    readStream = fs.createReadStream(path.resolve(__dirname,'./abstract-image.jpg'),{encoding: 'binary'});
    //var chunks =[] , delay = 0 ;

    socket.on('disconnect',() => {
        maxApi.post("Good bye disconnecting");
    });

    socket.on('input',(msg) => {
        maxApi.outlet('input',msg);
        io.emit('mess', msg);
    });

    socket.on('newImage',(image) => {
        maxApi.post('ask for a new image',image);
        readStream2 = "";
        readStream2 = fs.createReadStream(path.resolve(__dirname,'./abstract-photography.jpg'),{encoding: 'binary'});
        //io.emit('mess', msg);
        readStream2.on('data', chunk => {
            console.log('readStream2---------------------------------');
            console.log(chunk);
            io.emit('img-chunk', chunk);
            console.log('readStream2---------------------------------');
          });
        readStream2.on('open', () => {
            console.log('Stream opened...');
        });
        readStream2.on('end', () => {
            console.log('Stream Closed...');
        });
    });

    readStream.on('data', chunk => {
        //console.log('---------------------------------');
        //console.log(chunk);
        //io.emit('mess4', chunk);
        io.emit('img-chunk', chunk);
        //console.log('---------------------------------');
      });

    readStream.on('open', () => {
        console.log('Stream opened...');
    });
    readStream.on('end', () => {
        console.log('Stream Closed...');
    });

});

maxApi.addHandler('message', (msg) => { // let's create 3 messages handlers
    io.emit('mess', msg);
});
maxApi.addHandler('message2', (msg) => { // for 2nd line message
    //console.log('message2 log',msg);
    io.emit('mess2', msg);
});
maxApi.addHandler('message3', (msg) => {// for 3rd line message
    io.emit('mess3', msg);
});

maxApi.addHandler('changeImage', (img) => {// for 3rd line message
    //readStream = "";
    maxApi.post('change image ... to ' + img);
    var imgName = "./abstract-photography";
    io.emit('changeImage', imgName);
    //readStream = fs.createReadStream(path.resolve(__dirname,'./abstract-photography.jpg'),{encoding: 'binary'});
});

server.listen(9009, () => {
    maxApi.post('listening on port #9009');
});