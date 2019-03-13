import React, { Component } from "react";
import ReactDOM from "react-dom";


class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: this.props.chat,
    }
    console.log("chat : Messenger.js" + this.state.chat);
  }


  render() {
    const divStyle = {
      border:"1px solid #000000",
      width:"400px",
      height: "200px"
    }
    const listStyle = {
      overflowY: "scroll",
      height: "200px"
    }

    return (
      <div style={divStyle}>
      
      </div>
    )
  }
}
export default Messenger;