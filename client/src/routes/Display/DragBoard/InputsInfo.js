import React, {Component} from 'react';

import ImageTemplate from './InfoTemplates/ImageTemplate';
import MessageTemplate from './InfoTemplates/MessageTemplate';

const $ = (id) => {return document.getElementById(id)};

class InputsInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {msg, img, setMsg, setImgInfo} = this.props;
    return (
      <div>
        <MessageTemplate
          isEditable={true}
          msg={msg}
          setMsg={setMsg}/>
        
        <ImageTemplate
          isEditable={true}
          img={img}
          setImgInfo={setImgInfo}/>
      </div>
    )
  }
}

export default InputsInfo;