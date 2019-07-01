import React, {Component} from 'react';

class MessageInput extends Component {
	constructor(props){
		super(props);
	}

	render() {
		const {idList, setMsg, isInput} = this.props;
		return (
			<div id={idList.messageInputID} className="input-group mb-3">

				<div className="input-group-prepend">
					<span
						className="input-group-text bg-white text-secondary border-secondary"
						id={idList.messagePrependID}
					>Text</span>
				</div>

				<input
					type="text"
					className="form-control"
					value={this.props.msg}
					aria-labelledby={idList.imgPrependID}
					onChange={(e)=> {isInput ?  setMsg(e.target.value) : ""}}
					readOnly={!isInput}
				/>
			</div>
		)
	}
}
export default MessageInput;