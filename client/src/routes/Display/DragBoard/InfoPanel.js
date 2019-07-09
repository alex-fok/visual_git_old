import React, {Component} from "react";
import ReactDOM from "react-dom";

import svgElementFunctions from './svgElementFunctions';

import InputsInfo from './InputsInfo';
import DetailsInfo from './DetailsInfo';
import OptionButtons from './OptionButtons';

class InfoPanel extends Component {
  constructor(props) {
    super(props);
    const {msg, img} = this.props;
    this.state={
      
      msgReceived: msg ? msg : "",
      imgReceived: img ? img : {
        fileName:"",
        src:""
      },
      msgInEdit: "",
      imgInEdit: {
        fileName: "",
        src: ""
      },
      isEditing: false
    }
    this.setMsg = this.setMsg.bind(this);
    this.setImgInfo = this.setImgInfo.bind(this);
    this.addInfo = this.addInfo.bind(this);
    this.setIsEditing = this.setIsEditing.bind(this);
  }

  setMsg(msg) {
    this.setState({
        msgInEdit: msg
    })
  }

  setImgInfo(event) {
    const fileDirectory = event.target.value;
    var fr = new FileReader();
    fr.readAsDataURL(event.target.files[0]);
    fr.onload = () => {
      this.setState({
        imgInEdit: {
          fileName: fileDirectory.replace(/\\/g, '/').replace(/.*\//, ''),
          src: fr.result
        }
      })
    }
  }

  addInfo(socket) {
    const {msgInEdit, imgInEdit} = this.state;
    svgElementFunctions.handleNewSVGElementRequest({
      msg: msgInEdit ? msgInEdit : "",
      img: imgInEdit ? imgInEdit : {
        fileName: "",
        src:""
      }
    }, socket);

    this.setState({
      msgInEdit: "",
      imgInEdit: {
        fileName: "",
        src: ""
      }
    })
  }

  setIsEditing(bool){
    this.setState({
      isInput: bool,
      isEditing: bool
    });
  }

  render(){
    const {socket, msg, img, isInput, setIsInput, dimension} = this.props;
    const {msgReceived, imgReceived, msgInEdit, imgInEdit, isEditing} = this.state;
    console.log(this.props.msg);
    return (
      <div 
        className="panel border"
        style={{width: dimension.width, height: dimension.height}}
      >
      {isInput ?      
        <InputsInfo
          socket={socket}
          msg={msgInEdit}
          img={imgInEdit}
          setMsg={this.setMsg}
          setImgInfo={this.setImgInfo}
          addInfo={this.addInfo}/>
      :
        <DetailsInfo
          msg={msgReceived}
          img={imgReceived}
          setMsg={this.setMsg}
          setImgInfo={this.setImgInfo}
          setIsEditing={this.setIsEditing}/>      
      }
      <OptionButtons
        isInput={isInput}
        isEditing={isEditing}
        socket={socket}
        addInfo={this.addInfo}
        setIsInput={setIsInput}
        setIsEditing={this.setIsEditing}
      />
      </div>
    )
  }
}

export default InfoPanel;