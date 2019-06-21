import React, {Component} from 'react';
import ReactDOM from "react-dom";

class InfoPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render(){
		return (
			<div style={{width: details_w, height: details_h}}>
				<div className="panel border" id={panelID}>
					<div id={detailsID}>
						<div className="inlineType" id={detailsMsgID}></div>
						<div className="imgContainer" id={detailsImgID}></div>
						<div className="atBottom" id={closeButtonID}></div>
					</div>

					<div id={inputID}>
						<div id={messageInputID} className="input-group mb-3"></div>
						<div id={imgInputID} className="input-group mb-3"></div>
						<div id={imgPreviewID} className="imgContainer"></div>
						<div className="inlineType atBottom" id={addButtonID}></div>
					</div>
				</div>
			</div>
		)
	}
}

export default InfoPanel;