import React, { Component } from "react";
import ReactDOM from "react-dom";


class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
        chat: new Array()
    }
  }
  render() {
    const divStyle = {
      border:"1px solid #000000",
      width:"400px"
    }
    const listStyle = {
      overflowY: "scroll",
      height: "200px"
    }

    return (
      <div style={divStyle}>
        <ul className="list-group" style={listStyle}>
          <li className="list-group-item">
            <p>1</p>
          </li>
          <li className="list-group-item">
            
          </li>
          <li className="list-group-item">
            <p>3</p>
          </li>
          <li className="list-group-item">
            <p>4</p>
          </li>
          <li className="list-group-item">
            <p>5</p>
          </li>
          <li className="list-group-item">
            <p>6</p>
          </li>
          <li className="list-group-item">
            <p>7</p>
          </li>
          <li className="list-group-item">
            <p>8</p>
          </li>
        </ul>
      </div>

    )
  }
}

export default Messenger;