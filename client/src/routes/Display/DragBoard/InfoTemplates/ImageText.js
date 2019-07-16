import React, {Component} from 'react';

class ImageText extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {fileName, imgPrependID, isEditable} = this.props;
    return (
      <input
        type="text"
        className="form-control"
        value={fileName ? fileName : ""}
        placeholder={fileName ? "" : "[No Image]"}
        aria-labelledby={imgPrependID}
        style={isEditable ? {backgroundColor: "white"} : {}}
        disabled
      />
    )
  }
}

export default ImageText;