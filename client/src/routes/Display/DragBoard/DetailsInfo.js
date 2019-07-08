import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MessageTemplate from './InfoTemplates/MessageTemplate';
import ImageTemplate from './InfoTemplates/ImageTemplate';

class DetailsInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			msg: this.props.msg,
			img: this.props.img,
			isEditing: false
		}
		this.setIsEditing = this.setIsEditing.bind(this);
	};

	setIsEditing(){
		this.setState(prev => {
			isEditing: !prev
		})
	}

	setImageInfo(e){
		
	}

	render() {
		const {msg, img} = this.props;
		const {setIsInput, isEditing, setIsEditing, setImgInfo, setMsg} = this.props;
		return (
			<div>
				<MessageTemplate
					isInput = {isEditing}
					msg={msg}
					setMsg={setMsg}/>

				<ImageTemplate
					isInput = {isEditing}
					img={img}
					setImgInfo={setImgInfo}/>

				<span className="atBottom mb-3 btn-group">
					<button
						type="button"
						className="btn btn-secondary"
						onClick= {(e)=> {
							setIsInput()
						}}
					>Close</button>
					<button
						className="btn btn-secondary"
						onClick={(e)=> {setIsEditing()}}>
					{isEditing ? "Finish Edit" : "Edit"}
					</button>
				</span>

			</div>
		)
	};
}

export default DetailsInfo;