import React, { Component } from "react";
import ReactDOM from "react-dom";
import Paragraph from "../presentational/Paragraph"

class ParagraphContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Paragraph text={this.props.value}/>
    );
  }
}

export default ParagraphContainer;