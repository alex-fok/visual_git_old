import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MessageInput from './InputComponents/MessageInput';
import ImageInput from './InputComponents/ImageInput';	

class InputsInfo extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {idList} = this.props;
		return (
			<div id={idList.inputID}>
				<MessageInput idList={idList} />
				<ImageInput idList={idList} />
				<div id={idList.imgInputID} className="input-group mb-3"></div>
				<div id={idList.imgPreviewID} className="imgContainer"></div>
				<div id={idList.addButtonID} className="inlineType atBottom"></div>
			</div>
		)
	}
}

export default InputsInfo;