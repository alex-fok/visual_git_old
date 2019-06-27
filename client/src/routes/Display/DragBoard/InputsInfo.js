import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MessageInput from './InputComponents/MessageInput';
import ImageInput from './InputComponents/ImageInput';	

class InputsInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			msg: "",
			img: ""
		}

		this.setMsg = this.setMsg.bind(this);
		this.setImg = this.setImg.bind(this);
	}

	setMsg(msg) {
		this.setState({
			msg: msg
		})
	}

	setImg(img) {
		this.setState({
			img: img
		})
	}

	render() {
		const {idList} = this.props;
		return (
			<div id={idList.inputID}>
				<MessageInput
					idList={idList}
					setMsg={this.setMsg}/>
				
				<ImageInput
					idList={idList}
					setImg={this.setImg}/>
				
				<div id={idList.addButtonID} className="inlineType atBottom"></div>
			</div>
		)
	}
}

export default InputsInfo;