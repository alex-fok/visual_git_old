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
		const {isInput, setIsInput, dimension, msg, img} = this.props;
		return (
			<div 
				className="panel border"
				style={{width: dimension.width, height: dimension.height}}
			>
			{isInput ?		
				<InputsInfo
					style={isInput ? {display: "none"} : {display: "block"}}
					socket={this.props.socket}/>
			:
				<DetailsInfo
					msg={msg}
					img={img && img.fileName ? img : {
						fileName: "[No Image]",
						src: ""
					}}
					setIsInput={this.props.setIsInput}
					style={isInput ? {display: "block"} : {display: "none"}}/>		
			}
				
			</div>
		)
	}
}

export default InfoPanel;