import React from "react";
import PropTypes from "prop-types";

const Dialog = ({textInput, textUpdate, onChange}) => (
  <div>
    <textarea autoFocus rows="4" cols="50" value={textInput} onChange={onChange}></textarea>

  </div>
)

export default Dialog;