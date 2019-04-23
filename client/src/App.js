import React, { Component } from "react";
import ReactDOM from "react-dom";

import {BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Loadable from 'react-loadable';
import io from 'socket.io-client';

//import ImgFromServer from './routes/Imagearea/ImgFromServer';
//import Messenger from './routes/Messenger/Messenger';
import Display from './routes/Display/Display';
import PrivateRoute from './privateRoute';
import {httpRequestHandler} from './httpRequestHandler';

const AUTH_SERVER = process.env.AUTH_SERVER;

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      text: "Sending from TopLayer",
      httpRequestHandler: httpRequestHandler,
      display: "d1"
    };
    
    this.handleClick = this.handleClick.bind(this);
    this.setAxiosHeader = this.setAxiosHeader.bind(this);
    this.setDisplay = this.setDisplay.bind(this);
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
  
  setAxiosHeader(jwt) {
    let handler = this.state.httpRequestHandler;

    if (!handler) {
      console.log("Axios instance not initialized");
    }

    else if (handler.defaults.headers.common['Authorization'] != jwt) {
      handler.defaults.headers.common['Authorization'] = jwt;
      this.setState ({
        httpRequestHandler: handler
      })

      console.log("JWT Token @ setAxiosHeader: " + this.state.httpRequestHandler.defaults.headers.common['Authorization'])
    }
  }

  setDisplay(e) {
    const value = e.target.value;
    const {display} = this.state;
    console.log(value);
    if (display !== value) this.setState({
      display: value
    })
  }

  componentDidMount() {
    console.log("App.js - componentDidMount")
  }

  componentWillUnmount() {
    console.log("App.js - componentWillUnmount");
    this.state.socket.close();
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
        </div>
        </PrivateRoute>
        {/*
          <button onClick={this.handleClick}>Button</button>
          <button onClick={this.handleImgRequest}>IMG</button>
        */
        }
        <div className="btn-group">
          <button className="btn btn-secondary" value="d1" onClick={this.setDisplay}>Image</button>
          <button className="btn btn-secondary" value="d2" onClick={this.setDisplay}>Chat</button>
          <button className="btn btn-secondary" value="d3" onClick={this.setDisplay}>Drag</button>
        </div>
        {
        /*
        <ImgFromServer setImage={this.setImage}/>
        <Messenger chat={this.state.chat} authServer={AUTH_SERVER} socket={this.state.socket}/>
        */
        }
        <Display 
          display={this.state.display} 
          host={AUTH_SERVER} 
          httpRequestHandler={this.state.httpRequestHandler}
        />
      </div>
    );
  }
}

export default App;