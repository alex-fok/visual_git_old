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
    this.toEditMode = this.toEditMode.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
  }

  setMsg(msg) {
    this.setState({
        msgInEdit: msg
    })
  }

  componentDidMount() {
    this.setState({
      isEditing: false
    });
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

  addInfo() {
    const {msgInEdit, imgInEdit} = this.state;
    svgElementFunctions.handleNewSVGElementRequest({
      msg: msgInEdit ? msgInEdit : "",
      img: imgInEdit ? imgInEdit : {
        fileName: "",
        src:""
      }
    }, this.props.socket);

    this.setState({
      msgInEdit: "",
      imgInEdit: {
        fileName: "",
        src: ""
      }
    })
  }

  toEditMode(){
  	const {msgReceived, imgReceived} = this.props;
    const {msgInEdit, imgInEdit} = this.state;
    this.setState({
      isEditing: true,
      msgInEdit: msgInEdit ? msgInEdit : msgReceived,
      imgInEdit: imgInEdit && imgInEdit.fileName ? imgInEdit : imgReceived
    });
  }

  saveChanges(){
    console.log("Save changes");
    const {msgInEdit, imgInEdit} = this.state;
    this.setState({isEditing: false});
    svgElementFunctions.handleEditRequest({
      id: this.props.svgId,
      msg: msgInEdit ? msgInEdit : "",
      img: imgInEdit ? imgInEdit : {
        fileName: "",
        src:""
      }
    }, this.props.socket);
  }

  closeDetails(){
  	this.setState({
  		msgInEdit: "",
  		imgInEdit: {
        fileName: "",
        src: ""
      },
      isEditing: false
  	})
  	this.props.setIsInput(true);
  }

  render(){
    const {socket, msgReceived, imgReceived, isInput, dimension} = this.props;
    const {msgInEdit, imgInEdit, isEditing} = this.state;
    return (
      <div 
        className="panel border"
        style={{width: dimension.width, height: dimension.height}}
      >
      {isInput ?      
        <InputsInfo
          msg={msgInEdit}
          img={imgInEdit}
          setMsg={this.setMsg}
          setImgInfo={this.setImgInfo}/>
      :
        <DetailsInfo
          msg={isEditing ? msgInEdit : msgReceived}
          img={isEditing ? imgInEdit : imgReceived}
          isEditing={isEditing}
          setMsg={this.setMsg}
          setImgInfo={this.setImgInfo}
          closeDetails={this.closeDetails}/>      
      }
      <OptionButtons
        isInput={isInput}
        isEditing={isEditing}
        socket={socket}
        addInfo={this.addInfo}
       	toEditMode={this.toEditMode}
       	saveChanges={this.saveChanges}
        closeDetails={this.closeDetails}/>
      </div>
    )
  }
}

export default InfoPanel;