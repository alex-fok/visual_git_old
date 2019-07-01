import React, {Component} from 'react';

class ImageText extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<input
				type="text"
				className="form-control"
				value={this.props.fileName}
				aria-labelledby={this.props.imgPrependID}
				disabled
			/>
		)
	}
}

export default ImageText;