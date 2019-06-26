import React, {Component} from 'react';

class MessageInput extends Component {
	constructor(props){
		super(props);
	}
	render() {
		const {idList} = this.props;
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
					id={idList.messageID}
					className="form-control"
					placeholder="Text..."
					aria-label="Text"
					aria-labelledby={idList.messagePrependID}
				/>
			</div>
		)
	}
}
export default MessageInput;