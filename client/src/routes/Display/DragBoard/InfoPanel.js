import React, {Component} from "react";
import ReactDOM from "react-dom";

import idList from './idList.json';

import InputsInfo from './InputsInfo';
import DetailsInfo from './DetailsInfo';
class InfoPanel extends Component {
	constructor(props) {
		super(props);
	}

	toggleDisplayedInfo(isInput, idList){
		return isInput ? 
			<InputsInfo idList={idList} /> : 
			<DetailsInfo idList={idList} />
	}

	render(){
		const {isInput, idList, dimension} = this.props;
		return (
			<div 
				className="panel border"
				id={idList.panelID}
				style={{width: dimension.width, height: dimension.height}}
			>			
				<InputsInfo
					idList={idList}
					style={isInput ? {display: "none"} : {display: "block"}}
					socket={this.props.socket}
					/>
				<DetailsInfo idList={idList} style={isInput ? {display: "block"} : {display: "none"}}/>		
			{
				// 					<div id={detailsID}>
				// 						<div className="inlineType" id={detailsMsgID}></div>
				// 						<div className="imgContainer" id={detailsImgID}></div>
				// 						<div className="atBottom" id={closeButtonID}></div>
				// 					</div>
				
				// 					<div id={inputID}>
				// 						<div id={messageInputID} className="input-group mb-3"></div>
				// 						<div id={imgInputID} className="input-group mb-3"></div>
				// 						<div id={imgPreviewID} className="imgContainer"></div>
				// 						<div className="inlineType atBottom" id={addButtonID}></div>
				// 					</div>
			}
				
			</div>
		)
	}
}

export default InfoPanel;