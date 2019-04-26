import express from 'express';
import bodyParser from 'body-parser';
import {sign, verify, decode} from './jwt/jwtService';

//import jwtService from './key/jwtService.js';
//import helloWorldHandler from './src/js/handler/helloWorldHandler';

const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// const proxy = http.createServer((req, res) => {
//   res.statudCode = 200;
//   res.setHeader('Content-Type', 'text\plain');
//   res.end('okay');
// });

const jwtService = require('./jwt/jwtService.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const userList = [
  {"userID": "user1", "group": "1"},
  {"userID": "user2", "group": "1"},
  {"userID": "user3", "group": "2"},
  {"userID": "user4", "group": "2"},
  {"userID": "username", "group": "3"}
];

app.use((req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.get('/login', (req, res, next) => {
  console.log("****** /login GET ******");
  if (req && req.query) {
    console.log(req.query)
  };
  res.sendFile(path.join(__dirname+'/src/index.html'));
});

app.post('/login', (req, res, next) => {

  console.log("****** /login POST ******");

  var authentication = {
    user: "",
    authenticated: false
  }

  const {username} = req.body;

  var userExists = false;
  for (let i = 0; i < userList.length; i++) {
    if (userList[i].userID === username) {
      jwtService.sign({name: userList[i].userID}, (err, token) => {
        const next = req.query.next;
        userList[i].jwt = token;
        res.redirect(next.substring(0,next.length-1) + "?jwt=" + token);
      }); 
      break;
    }
    else if (i === userList.length-1) {
      res.sendFile(path.join(__dirname+'/src/index.html'));
    }
  }
});

app.use((req, res, next) => {
  //var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var token = req.headers.authorization;
  console.log("****** START HTTP REQUEST ******");
  console.log("URL: " + req.url);

  if(token) {
    let jwt = token.replace("Bearer ", "");
    console.log("JWT: " + jwt);
    jwtService.verify(jwt, (decoded) => {

      var userExists = false;
      for (var user in userList) {
        if (userList[user].userID === decoded.name) {

          userExists = true;
          res.locals.user = userList[user].userID;
          break;
        }
      }
      userExists ? next() : console.log("Invalid User");
    });
  }
  else {
    console.log("No token found");
    console.log("****** END HTTP REQUEST ******\n");
  }
});

app.post('/api/getUser', (req, res, next) => {
  console.log("User: "+ res.locals.user);
  res.json({user: res.locals.user});
  next();
});

io.on('connection', (socket) => {

  const broadcastMessage = (num) => {
    const fs = require('fs');
    if (num < 4) {
      console.log("Drawing number: " + num);
      fs.readFile(__dirname + '/image/image' + num + '.png', (err, buf) => {
        if (!err) {
          io.emit('image', {buffer: buf.toString('base64')});
          setTimeout(()=> {broadcastMessage(num + 1)}, 1000)
        }
      });
    }
    else {
      console.log("Last drawing sent");
      console.log("******END DRAWING BROADCAST******\n")
    };
  }
  const socketAuthentication = (jwt, callback) => {
    jwtService.verify(jwt, (decoded) => {
      for (var user in userList) {
        var id = userList[user].userID;

        if (id === decoded.name) {
          callback(id);
        }
      }
    })
  }

  socket.on('image', () => {
    console.log("******START DRAWING BROADCAST******");
    setTimeout(() => {broadcastMessage(0)}, 1000);
  });

  socket.on('message', (data) => {
    console.log("******MESSAGE RECEIVED******");
    socketAuthentication(data.jwt, (id) => {
      console.log("      input: " + data.message);
      io.emit("message", id + ": " + data.message);
      console.log("******END MESSAGE BROADCAST******\n");  
    })
  });

  socket.on('createSVG', (data)=> {
    console.log("******CREATE SVG REQ******");
    console.log("      svg: " + JSON.stringify(data));
    io.emit("svgAdd", data);
    console.log("******END CREATE SVG REQ******")
  });

  socket.on('svgCopyRequest', (jwt) => {
    socketAuthentication(jwt, (id) => {
      console.log("svgCopyRequest from %s; (socket id: %s)", id, socket.id);
      socket.broadcast.emit('serverReqSvg', socket.id)
    })
  });

  socket.on('svgToServer', (data) => {
    socketAuthentication(data.jwt, (id) => {
      console.log("svgToServer from %s; (socket id: %s)", id, socket.id);
      console.log(data);
      socket.broadcast.to(data.socketid).emit("svgToClient", data.svgElements);  
    })
  });

});

app.get('/api/helloWorld', (req, res, next) => {
  console.log("****** /api/helloWorld GET ******");
  res.json({ hello : "HELLO WORLD" });
  next();
});

app.use('*', (req, res, next) => {
  console.log("****** END HTTP REQUEST ******\n");
});

http.listen(4000, ()=> {
  console.log('Listening\n');
});