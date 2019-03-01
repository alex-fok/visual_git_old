import React, { Component } from "react";
import ReactDOM from "react-dom";

import {BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Loadable from 'react-loadable';
import io from 'socket.io-client';

import ImgFromServer from './routes/Imagearea/ImgFromServer';
import PrivateRoute from './privateRoute';
import {httpRequestHandler} from './httpRequestHandler';

const AUTH_SERVER = process.env.AUTH_SERVER;

class App extends Component {
  constructor() {
    super();
    this.state = {
      text: "Sending from TopLayer",
      httpRequestHandler: httpRequestHandler,
      socket: io(AUTH_SERVER)
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleImgRequest = this.handleImgRequest.bind(this);
    this.setAxiosHeader = this.setAxiosHeader.bind(this);
    this.setImage = this.setImage.bind(this);
  }

  handleClick(event) {
    const {httpRequestHandler} = this.state;
    
    httpRequestHandler({
      method: 'get',
      url: '/api/helloWorld',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      data: {
        jwt: httpRequestHandler.defaults.headers.common['Authorization']
      }
    }).then((res) => {
      const helloWorld = JSON.stringify(res.data.hello);
      console.log(helloWorld);
      this.setState({
        text:helloWorld.substring(1, helloWorld.length-1)
      })
    });

    // fetch; no dependencies
    /*
    fetch('/api/helloWorld')
    .then(response => response.json())
    .then(data => console.log(data.hello));
    */
  }

  handleImgRequest(event) {
    this.state.socket.emit("message", "message");
  }

  setAxiosHeader(jwt) {
    let handler = this.state.httpRequestHandler;

    if (!handler) {
      console.log("Axios instnace not initialized");
    }

    else if (handler.defaults.headers.common['Authorization'] != jwt) {
      handler.defaults.headers.common['Authorization'] = jwt;
      this.setState ({
        httpRequestHandler: handler
      })

      console.log("JWT Token @ setAxiosHeader: " + this.state.httpRequestHandler.defaults.headers.common['Authorization'])
    }
  }

  setImage(ctx) {
    this.state.socket.on('image', (data) => {
      if(data.buffer) {
        console.log('setSocket is reached');
        console.log("wait 1 second");
        setTimeout(()=> {
          console.log("wait completed");
          const img = new Image();
          img.src = 'data:image/jpeg;base64, ' + data.buffer;
          img.onload = () => {ctx.drawImage(img, 0, 0)};
        }, 1000)
        
      }
    })
  }

  render() {
    const {text} = this.state;

    const Loading = () => <div>Loading...</div>;

    const Home = Loadable({
      loader: () => import('./routes/Home/container/FormContainer'),
      loading: Loading,
    });

    const Textarea = Loadable({
      loader: () => import('./routes/Textarea/container/DialogContainer'),
      loading: Loading,
    });

    const HomeInstance = <Home
      onChange = {((e) => {
        this.setState({
          text: e.target.value
        })}).bind(this)
      }
      textInput = {this.state.text}
    />;

    const TextareaInstance = <Textarea
      onChange = {((e) => {
        this.setState({
          text: e.target.value
        }).bind(this)
      })}
    />;

    const headerStyle = {
      backgroundColor: "#999999",
      padding: "5px",
      width: "400px",
      color: "#FFFFFF"
    }

    const linkStyle= {
      color: "#FFFFFF"
    }

    return (
      <div>
        <PrivateRoute setAxiosHeader={this.setAxiosHeader} host={AUTH_SERVER}>
        <div>
          <div style={headerStyle}>
            <Link style={linkStyle} to="/">Home</Link>
            {" | "}
            <Link style={linkStyle} to="/textArea">Textarea</Link>
          </div>
          <Switch>
            <Route exact path="/" render={()=>
              { return HomeInstance }
            }/>
            <Route path="/textArea" render={()=>
              { return TextareaInstance }
            }/>
          </Switch>
          <button onClick={this.handleClick}>Button</button>
          <button onClick={this.handleImgRequest}>IMG</button>
        </div>
        </PrivateRoute>
        <ImgFromServer setImage={this.setImage}/>
      </div>
    );
  }
}

export default App;

const wrapper = document.getElementById("top-layer-div");
wrapper ? ReactDOM.render(<App />, wrapper) : false;