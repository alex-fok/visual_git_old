import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MessageTemplate from './InfoTemplates/MessageTemplate';
import ImageTemplate from './InfoTemplates/ImageTemplate';

class DetailsInfo extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const {msg, img} = this.props;
    const {setIsInput, isEditing, setImgInfo, setMsg} = this.props;
    return (
      <div>
        <MessageTemplate
          isEditable = {isEditing}
          msg={msg}
          img={img}
          setMsg={setMsg}/>

        <ImageTemplate
          isEditable = {isEditing}
          img={img}
          setImgInfo={setImgInfo}/>

      </div>
    )
  };
}

export default DetailsInfo;