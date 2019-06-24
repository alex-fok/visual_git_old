import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class InputsInfo extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {idList} = this.props;
		console.log(idList.messageInputID);
		return (
			<div id={idList.inputID}>				
				<div id={idList.messageInputID} className="input-group mb-3"></div>
				<div id={idList.imgInputID} className="input-group mb-3"></div>
				<div id={idList.imgPreviewID} className="imgContainer"></div>
				<div id={idList.addButtonID} className="inlineType atBottom"></div>
			</div>
		)
	}
}

export default InputsInfo;