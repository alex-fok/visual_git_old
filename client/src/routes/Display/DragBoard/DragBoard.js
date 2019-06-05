import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';
import svgElementController from './svgElementController';
import './DragBoard.css';

const svgNS = "http://www.w3.org/2000/svg";

const svgContainerID = "svgContainer"
const svgElementID = "dragBoard";
const svgObjTagID = "svgObjTag";

const controlPanelID = "controlPanel";

const detailsID = "details";
const detailsContentID = "details-content";
const messageInputID = "message-input";
const closeButtonID = "close-button";

const inputID = "input";
const addButtonID = "add-button";
const messageID = "message";

const size = 800;

const div_w = size;
const div_h = size*.5;

const svg_w = div_w*.4;
const svg_h = div_h;

const details_w = div_w*.4;
const details_h = div_h;

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
									<div id={controlPanelID}>
										<div id={detailsID}>
											<div className="inlineType" id={detailsContentID}></div>
											<div className="absoluteBottom" id={closeButtonID}></div>
										</div>
										<div id={inputID}>
											<div className="inlineType" id="message-input"></div>
											<div className="inlineType" id="add-button"></div>
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