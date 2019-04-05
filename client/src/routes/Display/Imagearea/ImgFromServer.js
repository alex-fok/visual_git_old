import React, { Component } from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";


class ImgFromServer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io( this.props.host, {
        transports: ['websocket']
      })
    }
    this.handleImgRequest = this.handleImgRequest.bind(this);
  }

  componentDidMount() {
    const ctx = document.getElementById('canvas').getContext('2d');
    this.state.socket.on('image', (data) => {
      if(data.buffer) {
        const img = new Image();
        img.src = 'data:image/jpeg;base64, ' + data.buffer;
        img.onload = () => {ctx.drawImage(img, 0, 0)};
      }
    })
  }

  componentWillUnmount() {
    this.state.socket.close();
  }

  handleImgRequest() {
    this.state.socket.emit("image");
  }

  render() {
    const canvasStyle = {
      border:"1px solid #000000"
    }
    return(
      <div>
        <canvas id="canvas" height="400" width="400" onClick={this.handleImgRequest} style={canvasStyle}></canvas>
      </div>
    )
  }
}

export default ImgFromServer;