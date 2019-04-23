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
    this.user = "";
  }

  componentDidMount() {
    const {httpRequestHandler} = this.props;
    httpRequestHandler({
      method: 'post',
      url: '/api/getUser',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      data: {
        jwt: httpRequestHandler.defaults.headers.common['Authorization']
      }
    }).then((data)=> {
      this.user = data.userName;
    });
    console.log(this.user);
  }

  getImgDisplayComponent() {
    console.log("getImgDisplayComponent Reached");
    return <ImgFromServer host={this.props.host} user={this.user}/>;
  }

  getMessengerComponent() {
    console.log("getMessengerComponent Reached");
    return <Messenger host={this.props.host} user={this.user}/>;
  }

  getDragBoardComponent() {
    console.log("getDragBoardComponent Reached");
    return <DragBoard host={this.props.host} user={this.user}/>;
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