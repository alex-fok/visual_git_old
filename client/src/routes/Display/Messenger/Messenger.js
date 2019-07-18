import React, { Component } from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";

var chat = [];

class Messenger extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      chat:chat,
      socket: io( this.props.host, {
        transports: ['websocket']
      })
    };
    
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    
  }

  handleMessageSubmit(){
    const data = {
      jwt: this.props.jwt,
      message: document.getElementById("usertext").value
    }
    this.state.socket.emit("message", data);
    document.getElementById("usertext").value = "";
  }

  componentDidMount() {  
    this.state.socket.on('message', (message) => {
      if (message) {
        this.setState(prevState => ({
          chat: [...prevState.chat, message]
        }));
      }
    });
  }

  componentWillUnmount() {
    
    chat = this.state.chat;
    this.state.socket.close();
  }

  render() {
    const MsgStyle = {
      border:"1px solid #000000",
      width:"350px",
      height: "200px"
    }
    const listStyle = {
      overflowY: "scroll",
      height: "200px"
    }
    const DialogStyle = {
      border:"1px solid #000000",
      height: "30px",
      resize: "none",
    }

    return (
      <div>
        <div style={MsgStyle}>
          <ul style={listStyle}>
            {this.state.chat.map((m, i)=> {
              return <li key={i}>{m}</li>
            })}
          </ul>
        </div>
        <div className="container">
          <div className="row" style={{width: "400px"}}>
            <div className="col">
              <input id="usertext" style={DialogStyle} placeholder={"Chat as "+ this.props.user}/>            
              <button onClick={this.handleMessageSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Messenger;