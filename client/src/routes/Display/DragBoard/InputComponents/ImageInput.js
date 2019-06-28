import React, {Component} from 'react';
import ImageText from './ImageText.js'

const htmlNS = "http://www.w3.org/1999/xhtml";

class ImageInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			imgName: ""
		};

		this.fileInput = this.fileInput.bind(this);
	}

	fileInput(e) {
		const {idList, setImgInfo} = this.props;
		const val = e.target.value;
		
		var fr = new FileReader();
		fr.readAsDataURL(e.target.files[0]);

		fr.onload = () => {

			this.imgPreviewRef.current.appendChild((()=> {
				var imgElement = document.createElementNS(htmlNS, "img");
				imgElement.setAttributeNS(null, "id", idList.imgID);
				imgElement.setAttributeNS(null, "src", fr.result);
				
				return imgElement;
			})());
		};
	}


	render() {
		const {idList, img} = this.props;
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
						onChange={(e)=> {this.props.setImgInfo(e)}}
					/>
					</span>
					{console.log("IMAGEINPUT.JS: img.fileName " + img.fileName)}
					<ImageText
						fileName={img.fileName}
						idList={{
							imgPrependID: idList.imgPrependID
						}}
					/>
				</label>

				<div
					className="imgContainer">
					{img.src ?
						<img src={img.src} /> :
						<p>[No Image to display]</p>
					}
				</div>
			</div>
		)
	}

}

export default ImageInput;