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
			detailsContentID = "details-content",
			messageInputID = "message-input",
			closeButtonID = "close-button",
			inputID = "input",
			addButtonID = "add-button",
			messageID = "message",
			imgInputID = "imgInput",
			imageID = "image",
			imgPreviewID = "imagePreview";

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
					detailsContentID: detailsContentID
				}
			});

		svgElementController.initDisplay(
			{
				svgContainerID: svgContainerID,
				svgElementID: svgElementID,
				messageInputID: messageInputID,
				messageID: messageID,
				imgInputID: imgInputID,
				imageID: imageID,
				imgPreviewID: imgPreviewID,
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
								{/*<svg
										width="100%"
										height="100%"
										onMouseMove={(e)=>svgElementController.handleMouseMove(e, this, svgElementID)}
										onMouseLeave={(e)=>svgElementController.notDragged(e, this, svgElementID)}
										onMouseUp={(e)=>svgElementController.notDragged(e, this, svgElementID)}
										style={{backgroundColor: "#999"}}
									></svg>
									*/
								}
								{/*<input type="text" id="message" placeholder="Add message..."/>
								*/
								}	
								{/*<button onClick={(e) => {
									const val = document.getElementById("message").value;
									svgElementController.handleNewSVGElementRequest(e, val, this);
									document.getElementById("message").value = "";
								}}>BUTTON</button>
								*/
								}
							</div>
							<div className="col">
								<div style={{width: details_w, height: details_h}}>
									<div className="panel" id={panelID}>
										<div id={detailsID}>
											<div className="inlineType" id={detailsContentID}></div>
											<div className="atBottom" id={closeButtonID}></div>
										</div>
										<div id={inputID}>
											<div id={messageInputID}></div>
											<br/>
											<div id={imgInputID} className="input-group"></div>
											<div id={imgPreviewID}></div>
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