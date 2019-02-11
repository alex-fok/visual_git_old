import React, { Component } from "react";
import ReactDOM from "react-dom";
import Dialog from "../presentational/Dialog"

class DialogContainer extends Component {
  constructor(props) {
    super(props);
    this.state={
      text:""
    }
  }
  textUpdate(text) {
    this.setState({
      text:text
    })
  }
  render() {
    return (
      <Dialog textInput={this.props.textInput} textUpdate={this.textUpdate.bind(this)} onChange={this.props.onChange}/>
    );
  }
}

export default DialogContainer;

//const wrapper = document.getElementById("dialog-div");
//wrapper ? ReactDOM.render(<DialogContainer />, wrapper) : false;