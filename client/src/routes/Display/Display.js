import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';

import ImgFromServer from './Imagearea/ImgFromServer';
import Messenger from './Messenger/Messenger';
import DragBoard from './DragBoard/DragBoard';

class Display extends Component {
  constructor(props) {
    super(props);
    
    this.getImgDisplayComponent = this.getImgDisplayComponent.bind(this);
    this.getMessengerComponent = this.getMessengerComponent.bind(this);
    this.getDragBoardComponent = this.getDragBoardComponent.bind(this);
    this.componentToDisplay = this.componentToDisplay.bind(this);

  }

  getImgDisplayComponent(host, jwt, user) {
    return <ImgFromServer host={host} jwt={jwt} user={user}/>;
  }

  getMessengerComponent(host, jwt, user) {
    return <Messenger host={host} jwt={jwt} user={user}/>;
  }

  getDragBoardComponent(host, jwt, user, offset) {
    return <DragBoard host={host} jwt={jwt} user={user} offset={offset}/>;
  }

  componentDidMount() {
    console.log("Display.js is mounted")
  }

  componentWillUnmount() {
    console.log("Display.js is unmounted");
  }


  componentToDisplay() {
    const {display, host, jwt, user, offset} = this.props;

    return(
      "d1" === (display) ? 
      this.getImgDisplayComponent(host, jwt, user):
      "d2" === (display) ?
      this.getMessengerComponent(host, jwt, user):
      //"d3"
      this.getDragBoardComponent(host, jwt, user, offset)
    )
  }

  render() {
    return(
      <div>{this.componentToDisplay()}</div>
    );
  }
}

export default Display;