import React, { Component } from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';

class ImgFromServer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var socket = io(this.props.host);
    this.props.setSocket(socket);
  }

  render() {
    const canvasStyle = {
      border:"1px solid #000000"
    }
    return(
      <div>
      <p id="testP"></p>
      <canvas id="canvas" height="400" width="400" style={canvasStyle}></canvas>
      </div>
    )
  }
}

export default ImgFromServer;