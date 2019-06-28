import React, {Component} from 'react';

import svgElementFunctions from './svgElementFunctions'

import MessageInput from './InputComponents/MessageInput';
import ImageInput from './InputComponents/ImageInput';	

const $ = (id) => {return document.getElementById(id)};

class InputsInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			msg: "",
			img: {
				fileName: "",
				src: ""
			}
		}

		this.setMsg = this.setMsg.bind(this);
		this.setImgInfo = this.setImgInfo.bind(this);
		this.setImg = this.setImg.bind(this);
		this.addInfo = this.addInfo.bind(this);
	}

	setMsg(msg) {
		this.setState({
			msg: msg
		})
	}

	setImgInfo(event) {

		const fileDirectory = event.target.value;
		console.log(fileDirectory);
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

	setImg(img) {
		this.setState({
			img: img
		})
	}

	addInfo(socket) {
		const {msg, img} = this.state;
		const {idList} = this.props;
		svgElementFunctions.handleNewSVGElementRequest({
			msg: msg ? msg : "[No Message]",
			img: img
		}, socket);

		this.setState({
			msg: "",
			img: {
				fileName: "",
				src: ""
			}
		})
	}

	render() {
		const {idList} = this.props;
		return (
			<div id={idList.inputID}>
				<MessageInput
					idList={idList}
					msg={this.state.msg}
					setMsg={this.setMsg}
					/>
				
				<ImageInput
					idList={idList}
					img={this.state.img}
					setImgInfo={this.setImgInfo}/>
				
				<div 
					id={idList.addButtonID}
					className="inlineType atBottom"
				><button
					type="button"
					className="btn btn-secondary"
					onClick={(e)=> {
						this.addInfo(this.props.socket)
					}}
				>Add</button></div>
			</div>
		)
	}
}

export default InputsInfo;