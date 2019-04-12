import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';

import ImgFromServer from './Imagearea/ImgFromServer';
import Messenger from './Messenger/Messenger';
import DragBoard from './DragBoard/DragBoard';


class Display extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: [],
    }
    this.getImgDisplayComponent = this.getImgDisplayComponent.bind(this);
    this.getMessengerComponent = this.getMessengerComponent.bind(this);
    this.getDragBoardComponent = this.getDragBoardComponent.bind(this);
    this.componentToDisplay = this.componentToDisplay.bind(this);
  }

  getImgDisplayComponent() {
    console.log("getImgDisplayComponent Reached");
    return <ImgFromServer host={this.props.host}/>;
  }

  getMessengerComponent() {
    console.log("getMessengerComponent Reached");
    return <Messenger chat={this.state.chat} host={this.props.host}/>;
  }

  getDragBoardComponent() {
    console.log("getDragBoardComponent Reached");
    return <DragBoard />;
  }

  componentToDisplay() {
    const {display} = this.props;
    console.log("display @ Display.js: %s", display);

    return(
      "d1" === (display) ? 
      this.getImgDisplayComponent():
      "d2" === (display) ?
      this.getMessengerComponent():
      this.getDragBoardComponent()
    )
  }

  render() {
    return(
      <div>{this.componentToDisplay()}</div>
    );
  }
}

export default Display;