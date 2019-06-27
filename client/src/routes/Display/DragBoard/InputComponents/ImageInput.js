import React, {Component} from 'react';

const htmlNS = "http://www.w3.org/1999/xhtml";

class ImageInput extends Component {
	constructor(props) {
		super(props);
		this.fileInput = this.fileInput.bind(this);
		this.imgTxtRef = React.createRef();
		this.imgPreviewRef = React.createRef();
	}

	fileInput(e) {
		const {idList, refs, setImg} = this.props;

		const val = e.target.value;
		this.imgTxtRef.current.value = val.replace(/\\/g, '/').replace(/.*\//, '');
		
		var fr = new FileReader();
		fr.readAsDataURL(e.target.files[0]);

		fr.onload = () => {
			this.imgPreviewRef.current.appendChild((()=> {
				var imgElement = document.createElementNS(htmlNS, "img");
				const src = fr.result;

				imgElement.setAttributeNS(null, "id", idList.imgID);
				imgElement.setAttributeNS(null, "src", fr.result);
				setImg(src);
				return imgElement;
			})());
		};
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
						className="form-control-file"
						type="file"
						accept="image/*"
						style={{display:"none"}}
						onChange={(e)=> {this.fileInput(e)}}
					/>
					</span>
					<input
						type="text"
						className="form-control"
						ref={this.imgTxtRef}
						id={idList.imgTxtID}
						aria-labelledby={idList.imgPrependID}
						disabled
					/>
				</label>

				<div
					ref={this.imgPreviewRef}
					id={idList.imgPreviewID}
					className="imgContainer">
				</div>
			</div>
		)
	}

}

export default ImageInput;