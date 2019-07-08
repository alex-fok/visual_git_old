import React, {Component} from "react";
import ReactDOM from "react-dom";

import idList from './idList.json';

import InputsInfo from './InputsInfo';
import DetailsInfo from './DetailsInfo';
class InfoPanel extends Component {
	constructor(props) {
		super(props);
		this.state={
			editing: false,
			msg: "",
			img: {
				fileName: "",
				src: ""
			}
		}
		this.setIsEditing = this.setIsEditing.bind(this);
		this.setMsg = this.setMsg.bind(this);
		this.setImgInfo = this.setImgInfo.bind(this);
	}

	setMsg(msg) {
		this.setState({
			msg: msg
		})
	}

	setImgInfo(event) {
		const fileDirectory = event.target.value;
		var fr = new FileReader();
		fr.readAsDataURL(event.target.files[0]);
		fr.onload = () => {
			this.setState({
				img: {
					fileName: fileDirectory.replace(/\\/g, '/').replace(/.*\//, ''),
					src: fr.result
				}
			})
		}
	}

	setIsEditing(){
		this.setState(prev => ({
			editing: !prev.editing
		}));
	}

	render(){
		const {socket, isInput, setIsInput, dimension, msg, img} = this.props;
		return (
			<div 
				className="panel border"
				style={{width: dimension.width, height: dimension.height}}
			>
			{isInput ?		
				<InputsInfo
					style={isInput ? {display: "none"} : {display: "block"}}
					socket={socket}
					msg={this.state.msg}
					img={this.state.img}
					setMsg={this.setMsg}
					setImgInfo={this.setImgInfo}/>
			:
				<DetailsInfo
					msg={msg}
					img={img && img.fileName ? img : {
						fileName: "[No Image]",
						src: ""
					}}
					setMsg={this.setMsg}
					setImgInfo={this.setImgInfo}
					isEditing={this.state.editing}
					setIsInput={setIsInput}
					setIsEditing={this.setIsEditing}
					style={isInput ? {display: "block"} : {display: "none"}}/>		
			}
			</div>
		)
	}
}

export default InfoPanel;