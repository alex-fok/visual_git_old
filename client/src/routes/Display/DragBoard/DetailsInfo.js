import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MessageTemplate from './InfoTemplates/MessageTemplate';
import ImageTemplate from './InfoTemplates/ImageTemplate';

class DetailsInfo extends Component {
	constructor(props) {
		super(props);
		const {msg, img} = this.props;
		this.state = {
			msg: msg ? msg : "",
			img: img ? img : ""
		}
	};

	render() {
		const {idList} = this.props;
		return (
			<div id={idList.detailsID}>
				<MessageTemplate
					isInput = {false}
					idList={idList}
					msg={this.state.msg}/>
				
				<ImageTemplate
					isInput = {false}
					idList={idList}
					img={this.state.img}/>

				<div className="atBottom">
					<button
						type="button"
						className="btn btn-secondary"
						onClick= {(e)=> {
							this.props.setIsInput()
						}}
					>Close</button>
				</div>

			</div>
		)
	};
}

export default DetailsInfo;