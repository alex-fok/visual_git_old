import React, {Component} from "react";
import ReactDOM from "react-dom";

import idList from './idList.json';

import InputsInfo from './InputsInfo';
import DetailsInfo from './DetailsInfo';
class InfoPanel extends Component {
	constructor(props) {
		super(props);
	}

	render(){
		const {socket, isInput, setIsInput, dimension, msg, img} = this.props;
		return (
			<div 
				className="panel border"
				style={{width: dimension.width, height: dimension.height}}
			>
			{isInput ?		
				<InputsInfo
					style={isInput ? {display: "none"} : {display: "block"}}
					socket={socket}/>
			:
				<DetailsInfo
					msg={msg}
					img={img && img.fileName ? img : {
						fileName: "[No Image]",
						src: ""
					}}
					editing={this.state.editing}
					setIsInput={setIsInput}
					setEditing={this.setEditing}
					style={isInput ? {display: "block"} : {display: "none"}}/>		
			}
				
			</div>
		)
	}
}

export default InfoPanel;