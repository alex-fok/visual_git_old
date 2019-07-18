import React, { Component } from "react";
import ReactDOM from "react-dom";

import {BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Loadable from 'react-loadable';

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
      httpRequestHandler: httpRequestHandler,
      display: "d1"
    };
    
    this.handleClick = this.handleClick.bind(this);
    this.setAxiosHeader = this.setAxiosHeader.bind(this);
    this.setDisplay = this.setDisplay.bind(this);
  }

  componentDidMount() {
    const jwt = this.state.httpRequestHandler.defaults.headers.common['Authorization'];
    httpRequestHandler({
      method: 'post',
      url: '/api/getUser',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      data: {
        jwt: jwt
      }
    }).then((json)=> {
      this.setState({
        user: json.data.user
      });
    });
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

  setDisplay(d) {
    const {display} = this.state;
    
    if (display !== d) {
      console.log("Changing display to " + d);  
      this.setState({
        display: d
      })
    }
  }


  render() {
    const {text, display, httpRequestHandler, user} = this.state;
    let auth = httpRequestHandler.defaults.headers.common['Authorization'];
    const jwt = auth ? auth.replace("Bearer ", "") : "";

    const Loading = () => <div>Loading...</div>;
  
    return (
      <div>
      {
        <PrivateRoute setAxiosHeader={this.setAxiosHeader} host={AUTH_SERVER}>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              aria-controls="navbarId"
              aira-expanded="false"
              ></button>
            <div className="collapse navbar-collapse" id="navbarId">
              <ul className="navbar-nav" style={{cursor: "default"}}>
                <li className={`${this.state.display==="d1" ? "active" : ""} nav-item`}>
                  <a className="nav-link" value="d1" onClick={()=>{this.setDisplay("d1")}}>Image</a>
                </li>
                <li className={`${this.state.display==="d2" ? "active" : ""} nav-item`}>
                  <a className="nav-link" value="d2" onClick={()=>{this.setDisplay("d2")}}>Chat</a>
                </li>
                <li className={`${this.state.display==="d3" ? "active" : ""} nav-item`}>
                  <a className="nav-link" value="d3" onClick={()=>{this.setDisplay("d3")}}>Drag</a>
                </li>
                <li className={`${this.state.display==="d4" ? "active" : ""} nav-item`}>
                  <a className="nav-link" value="d4" onClick={()=>{this.setDisplay("d4")}}>File</a>
                </li>
              </ul>
            </div>
          </nav>
        <Display
          className="mb-10"
          display={display} 
          host={AUTH_SERVER} 
          jwt={jwt}
          user={user}
        />
        </div>
        </PrivateRoute>
      }
        
      
      </div>
    );
  }
}

export default App;