import React, {Component} from 'react';

class MessageInput extends Component {
	constructor(props){
		super(props);
	}

	render() {
		const messagePrependID = "messagePrepend";
		const {msg, setMsg, isInput} = this.props;
		return (
			<div className="input-group mb-3">

				<div className="input-group-prepend">
					<span
						className="input-group-text bg-white text-secondary border-secondary"
						id={messagePrependID}
					>Text</span>
				</div>

				<input
					type="text"
					className="form-control"
					value={msg}
					aria-labelledby={messagePrependID}
					onChange={(e)=> {isInput ? setMsg(e.target.value) : ""}}
					readOnly={!isInput}
				/>
			</div>
		)
	}
}
export default MessageInput;