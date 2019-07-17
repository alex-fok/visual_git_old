import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';

import ImgFromServer from './Imagearea/ImgFromServer';
import Messenger from './Messenger/Messenger';
import DragBoard from './DragBoard/DragBoard';
import FileSpace from './FileSpace/FileSpace';

class Display extends Component {
  constructor(props) {
    super(props);
    
    this.getImgDisplayComponent = this.getImgDisplayComponent.bind(this);
    this.getMessengerComponent = this.getMessengerComponent.bind(this);
    this.getDragBoardComponent = this.getDragBoardComponent.bind(this);
    this.getFileSPaceComponent = this.getFileSpaceComponent.bind(this);
    this.componentToDisplay = this.componentToDisplay.bind(this);

  }

  getImgDisplayComponent(host, jwt, user) {
    return <ImgFromServer host={host} jwt={jwt} user={user}/>;
  }

  getMessengerComponent(host, jwt, user) {
    return <Messenger host={host} jwt={jwt} user={user}/>;
  }

  getDragBoardComponent(host, jwt, user) {
    return <DragBoard host={host} jwt={jwt} user={user}/>;
  }

  getFileSpaceComponent(host, jwt, user) {
    return <FileSpace host={host} jwt={jwt} user={user}/>
  }


  componentDidMount() {
    console.log("Display.js is mounted")
  }

  componentWillUnmount() {
    console.log("Display.js is unmounted");
  }


  componentToDisplay() {
    const {display, host, jwt, user} = this.props;

    return(
      "d1" === (display) ? 
      this.getImgDisplayComponent(host, jwt, user):
      "d2" === (display) ?
      this.getMessengerComponent(host, jwt, user):
      "d3" === (display) ?
      this.getDragBoardComponent(host, jwt, user):
      //"d4"
      this.getFileSpaceComponent(host, jwt, user)
    )
  }

  render() {
    return(
      <div>{this.componentToDisplay()}</div>
    );
  }
}

export default Display;