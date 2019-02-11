import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "../presentational/Input";

class FormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seo_title: "",
      title: this.props.textInput,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onChange(event)
  }

  render() {
    const { seo_title } = this.state;
    return (
      <form id="article-form" action="/inputHandle">
        <Input
          text="SEO title"
          label="seo_title"
          type="text"
          id="seo_title"
          value={this.state.title}
          handleChange={this.handleChange}
        />
      </form>
    );
  }
}
export default FormContainer;

//const wrapper = document.getElementById("create-article-form");
//wrapper ? ReactDOM.render(<FormContainer />, wrapper) : false;