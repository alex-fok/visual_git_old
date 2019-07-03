import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MessageTemplate from './InfoTemplates/MessageTemplate';
import ImageTemplate from './InfoTemplates/ImageTemplate';

class DetailsInfo extends Component {
	constructor(props) {
		super(props);
	};

	render() {
		const {setIsInput, msg, img} = this.props;
		return (
			<div>
				<MessageTemplate
					isInput = {false}
					msg={msg}/>
				<ImageTemplate
					isInput = {false}
					img={img}/>

				<div className="atBottom">
					<button
						type="button"
						className="btn btn-secondary"
						onClick= {(e)=> {
							setIsInput()
						}}
					>Close</button>
				</div>

			</div>
		)
	};
}

export default DetailsInfo;