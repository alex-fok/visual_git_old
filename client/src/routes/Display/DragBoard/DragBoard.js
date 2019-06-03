import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';
import svgElementController from './svgElementController';
import './DragBoard.css';

const svgNS = "http://www.w3.org/2000/svg";

const svgContainerID = "svgContainer"
const svgElementID = "dragBoard";
const svgObjTagID = "svgObjTag";
const detailsID = "details";
const detailsContentID = "details-content";
const messageInputID = "message-input";
const addButtonID = "add-button";
const messageID = "message";

const size = 800;

const divW = size;
const divH = size*.5;

const svgW = divW*.5;
const svgH = divH;

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
					detailsContentID: detailsContentID
				}
			});

		svgElementController.initDisplay(
			{
				svgContainerID: svgContainerID,
				svgElementID: svgElementID,
				messageInputID: messageInputID,
				addButtonID: addButtonID
			}, {w: svgW, h: svgH}, this);
	}

	componentWillUnmount() {
		this.state.socket.close();
	}

	render() {

		return(
			<div>
				<div className="container-fluid noPadding">
					<div style={{width:divW, height:divH}}>
						<div className="row">
							<div className="col">
								<div id={svgContainerID} style={{width:svgW, height:svgH}}>
								{/*
									<svg
										id={svgElementID}
										xmlns={svgNS}
										viewBox={`0 0 ${svgW} ${svgH}`}
										width="100%"
										height="100%"
										onMouseMove={(e)=>svgElementController.handleMouseMove(e, this, svgElementID)}
										onMouseLeave={(e)=>svgElementController.notDragged(e, this, svgElementID)}
										onMouseUp={(e)=>svgElementController.notDragged(e, this, svgElementID)}
										style={{backgroundColor: "#999"}}
									></svg>
									*/
								}</div>
								{/*<input type="text" id="message" placeholder="Add message..."/>
								*/
								}
								<div className="inlineType" id="message-input"></div>
								<div className="inlineType" id="add-button">
								{/*<button onClick={(e) => {
									const val = document.getElementById("message").value;
									svgElementController.handleNewSVGElementRequest(e, val, this);
									document.getElementById("message").value = "";
								}}>BUTTON</button>
								*/
								}
								</div>
							</div>
							<div className="col">
								<div style={{width: divW*.25, height: divH}}>
									<div id={detailsID}>
										<div id={detailsContentID}></div>
										<button
											onClick={()=> {document.getElementById(detailsID).style.display = "none"}}
										>Close</button>
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