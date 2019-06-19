import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';
import svgElementController from './svgElementController';
import './DragBoard.css';

const svgNS = "http://www.w3.org/2000/svg";

const svgContainerID = "svgContainer",
			svgElementID = "dragBoard",
			svgObjTagID = "svgObjTag",
			panelID = "panel",
			detailsID = "details",
			detailsMsgID = "details-msg",
			detailsImgID = "details-img",
			messageInputID = "message-input",
			messagePrependID = "message-prepend",
			messageID = "message",
			closeButtonID = "close-button",
			inputID = "input",
			addButtonID = "add-button",
			imgInputID = "imgInput",
			imgPrependID = "imgPrepend",
			imgID = "image",
			imgPreviewID = "imagePreview",
			imgTxtID = "imgTxtID";

const size = 1200,
			div_w = size,
			div_h = size*.5,
			svg_w = div_w*.4,
			svg_h = div_h,
			details_w = div_w*.4,
			details_h = div_h;

class DragBoard extends Component {
	constructor(props) {
		super(props);
		this.state={
			socket: io(this.props.host, {transports: ['websocket']}),
      svgElements: {},
			draggedItem: {
				id: "",
				xFrom: 0,
				yFrom: 0
			},
			isDragging: false,
			updated: false
		}
	}

	componentDidMount() {
		//svgElementController.initSocket(obj, idList, fnList)
		svgElementController.initSocket(this, 
			{
				svgElementID: svgElementID,
				infoIDs: {
					svgObjTagID: svgObjTagID,
					detailsID: detailsID,
					inputID: inputID,
					detailsMsgID: detailsMsgID,
					detailsImgID: detailsImgID
				}
			});

		svgElementController.initDisplay(
			{
				svgContainerID: svgContainerID,
				svgElementID: svgElementID,
				messageInputID: messageInputID,
				messagePrependID: messagePrependID,
				messageID: messageID,
				imgInputID: imgInputID,
				imgPrependID: imgPrependID,
				imgID: imgID,
				imgPreviewID: imgPreviewID,
				imgTxtID: imgTxtID,
				addButtonID: addButtonID,
				closeButtonID: closeButtonID,
				detailsID: detailsID,
				inputID: inputID
			}, {w: svg_w, h: svg_h}, this);
	}

	componentWillUnmount() {
		this.state.socket.close();
	}

	render() {

		return(
			<div>
				<div className="container-fluid noPadding">
					<div style={{width:div_w, height:div_h}}>
						<div className="row">
							<div className="col">
								<div id={svgContainerID} style={{width:svg_w, height:svg_h}}></div>
							</div>
							<div className="col">
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
							</div>
						</div>
					</div>
				</div>
				<div id="svgObjTag"></div>
			</div>
		);
	}
}

export default DragBoard;