import React, {Component} from 'react';

class ImageInput extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {idList} = this.props;
		return (
			<div>
				<label className="input-group-prepend">
					<span
						id={idList.imgPrependID}
						className="btn btn-outline-secondary"
					>Image
					<input
						type="file"
						accept="image/*"
						className="form-control"
						style={{display:"none"}}
					/>
					</span>
				</label>
				<input
					type="text"
					className="form-control"
					id={idList.imgTxtID}
					aria-labelledby={idList.imgPrependID}
					disabled
				/>
			</div>
		)
	}

}

export default ImageInput;