import React, {Component} from 'react';

import svgElementFunctions from './svgElementFunctions';

import ImageTemplate from './InfoTemplates/ImageTemplate';
import MessageTemplate from './InfoTemplates/MessageTemplate';

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
		this.addInfo = this.addInfo.bind(this);
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

	addInfo(socket) {
		const {msg, img} = this.state;
		svgElementFunctions.handleNewSVGElementRequest({
			msg: msg ? msg : "[No Message]",
			img: img ? img : {
				fileName: "[No File]",
				src:""
			}
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
		const {msg, img, setMsg, setImgInfo} = this.props;
		return (
			<div>
				<MessageTemplate
					isInput
					msg={msg}
					setMsg={setMsg}/>
				
				<ImageTemplate
					isInput
					img={img}
					setImgInfo={setImgInfo}/>

				<div 
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