import React, { Component } from "react";
import ReactDOM from "react-dom";


class Messenger extends Component {
  constructor(props) {
    super(props);
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
      width:"400px",
      height: "50px"
    }

    return (
      <div>
      <div style={MsgStyle}>
        <ul style={listStyle}>
          {this.props.chat.map((m, i)=> {
            return <li key={i}>{i}{m}</li>
          })}
        </ul>
      </div>
      <div style={DialogStyle}></div>
      </div>
    )
  }
}
export default Messenger;