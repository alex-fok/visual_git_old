import React, { Component } from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";

class Messenger extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      chat:[],
      socket: this.props.socket
    };
    
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);

  }

  handleMessageSubmit(){
    const input = document.getElementById("usertext").value;
    const test = true;
    test ? 
      this.state.socket.emit("message", input) :
      this.setState(prevState => ({
        chat: [...prevState.chat, 'new message']
      }));
      
    document.getElementById("usertext").value = "";
  }

  componentDidMount() {
    console.log("Component Did Mount"); 

    this.state.socket.on('message', (message) => {
      if (message) {
        this.setState(prevState => ({
          chat: [...prevState.chat, message]
        }));
      }
    });
  }

  componentWillUnmount() {
    console.log("Component Unmounted");
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

    const wrapperStyle = {
      
    }

    const rowStyle = {
      width: "400px"
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
        <div className="container" style={wrapperStyle}>
          <div className="row" style={rowStyle}>
            <div className="col-8">
              <textarea id="usertext" style={DialogStyle} placeholder="Text..."/>
            </div>
            <div className="col-4">
              <button onClick={this.handleMessageSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Messenger;