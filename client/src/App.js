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
      text: "Sending from TopLayer",
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
    console.log("App.js is mounted");  
  }

  componentWillUnmount() {
    console.log("App.js is unmounted");
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
    
    if (display !== value) {
      console.log("Changing display to " + value);  
      this.setState({
        display: value
      })
    }
  }


  render() {
    const {text, display, httpRequestHandler, user} = this.state;
    let auth = httpRequestHandler.defaults.headers.common['Authorization'];
    const jwt = auth ? auth.replace("Bearer ", "") : "";

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
      <div id="topApp">
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

        <div className="btn-group">
          <button className="btn btn-secondary" value="d1" onClick={this.setDisplay}>Image</button>
          <button className="btn btn-secondary" value="d2" onClick={this.setDisplay}>Chat</button>
          <button className="btn btn-secondary" value="d3" onClick={this.setDisplay}>Drag</button>
        </div>

        <Display
          display={display} 
          host={AUTH_SERVER} 
          jwt={jwt}
          user={user}
        />
      
      </div>
    );
  }
}

export default App;