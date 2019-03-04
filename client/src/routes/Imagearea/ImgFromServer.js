import React, { Component } from "react";
import ReactDOM from "react-dom";

class ImgFromServer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const ctx = document.getElementById('canvas').getContext('2d');
    this.props.setImage(ctx);
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