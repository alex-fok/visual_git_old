import React, { Component } from "react";
import ReactDOM from "react-dom";


class Messenger extends Component {
  constructor(props) {
    super(props);
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
        <ul style={listStyle}>
          {this.props.chat.map((m, i)=> {
            return <li key={i}>{m}</li>
          })}
        </ul>
      </div>
    )
  }
}
export default Messenger;