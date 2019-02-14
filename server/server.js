import express from 'express';
import bodyParser from 'body-parser';
import {sign, verify, decode} from './jwt/jwtService';

//import jwtService from './key/jwtService.js';
//import helloWorldHandler from './src/js/handler/helloWorldHandler';

const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  path:'/io'
});

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
  {"userID": "xxxx"},
  {"userID": "yyyy"},
  {"userID": "John Smith"}
];

app.use((req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
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
  if (req && req.body) {
    jwtService.sign({name: "John Smith"}, (err, token) => {
      const next = req.query.next;
      console.log("****** /login POST ******");
      res.redirect(next.substring(0,next.length-1) + "?jwt=" + token);
    });
  }
});

app.use((req, res, next) => {
  //var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var token = req.headers.authorization;

  console.log("****** START HTTP REQUEST ******");
  console.log("URL: " + req.url);

  if(token) {
    console.log("Token: " + token);
    let jwt = token.replace("Bearer ", "");
    console.log("JWT: " + jwt);
    jwtService.verify(jwt, (decoded) => {

      var userExists = false;
      for (var user in userList) {
        if (userList[user].userID === decoded.name) {
          userExists = true;
          break;
        }
      }
      if (userExists) {
        next();
      } else {
        console.log("Invalid User");
      }
    });
  }
  else {
    console.log("No token found");
    console.log("****** END HTTP REQUEST ******\n");
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  // socket.on('image', (msg)=> {
  //   console.log('message: ' + msg);
  // });
});

app.get('/api/helloWorld', (req, res, next) => {
  console.log("****** /api/helloWorld GET ******");
  res.json({ hello : "HELLO WORLD" });
  next();
});

app.use('*', (req, res, next) => {
  console.log("****** END HTTP REQUEST ******\n");
});

app.listen(4000, ()=> {
  console.log('Listening');
});