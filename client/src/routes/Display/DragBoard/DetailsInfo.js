import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MessageTemplate from './InfoTemplates/MessageTemplate';
import ImageTemplate from './InfoTemplates/ImageTemplate';

class DetailsInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: this.props.msg,
      img: this.props.img,
      isEditing: false
    }
    this.setIsEditing = this.setIsEditing.bind(this);
  };

  setIsEditing(){
    this.setState(prev => {
      isEditing: !prev
    })
  }

  setImageInfo(e){
    
  }

  render() {
    const {msg, img} = this.props;
    const {setIsInput, isEditing, setIsEditing, setImgInfo, setMsg} = this.props;
    return (
      <div>
        <MessageTemplate
          isEditable = {false}
          msg={msg}
          setMsg={setMsg}/>

        <ImageTemplate
          isEditable = {false}
          img={img}
          setImgInfo={setImgInfo}/>

      </div>
    )
  };
}

export default DetailsInfo;