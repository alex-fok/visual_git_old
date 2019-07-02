import React, {Component} from 'react';

class ImageText extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {fileName, imgPrependID} = this.props;
		return (
			<input
				type="text"
				className="form-control"
				value={fileName ? fileName : ""}
				aria-labelledby={this.props.imgPrependID}
				disabled
			/>
		)
	}
}

export default ImageText;