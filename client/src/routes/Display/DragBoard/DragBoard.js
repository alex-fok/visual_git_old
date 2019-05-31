import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';
import svgElementController from './svgElementController';
import './DragBoard.css';

const svgNS = "http://www.w3.org/2000/svg";

const divContainerID = "divContainer"
const containerID = "svgContainer";
const svgTagID = "svgTag";
const detailsID = "details";
const detailsContentID = "details-content";

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
				containerID: containerID,
				infoIDs: {
					svgTagID: svgTagID,
					detailsID: detailsID,
					detailsContentID: detailsContentID
				}
			},
			{
			createRectSVGElement: (data => { return svgElementController.createRectSVGElement(...data)}),
			appendSVG: (data => {svgElementController.appendSVG(...data)}),
			handleMouseDown: (data => {svgElementController.handleMouseDown(...data)}),
			showTag: (data => {svgElementController.showTag(...data)}),
			hideTag: (data => {svgElementController.hideTag(...data)}),
			showDetails: (data => {svgElementController.showDetails(...data)})
		});

		svgElementController.initDisplay(divContainerID, containerID, svgW, svgH, this);
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
								<div id={divContainerID} style={{width:svgW, height:svgH}}>
								{/*
									<svg
										id={containerID}
										xmlns={svgNS}
										viewBox={`0 0 ${svgW} ${svgH}`}
										width="100%"
										height="100%"
										onMouseMove={(e)=>svgElementController.handleMouseMove(e, this, containerID)}
										onMouseLeave={(e)=>svgElementController.notDragged(e, this, containerID)}
										onMouseUp={(e)=>svgElementController.notDragged(e, this, containerID)}
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
										<div id="details-content"></div>
										<button
											onClick={()=> {document.getElementById(detailsID).style.display = "none"}}
										>Close</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="svgTag"></div>
			</div>
		);
	}
}

export default DragBoard;