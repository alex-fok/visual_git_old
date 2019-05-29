import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';
import svgElementController from './svgElementController';
import './DragBoard.css';

const svgNS = "http://www.w3.org/2000/svg";
const containerID = "svgContainer";
const svgTagID = "svgTag";
const detailsID = "details";
const size = 800;

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
		svgElementController.initSocket(this, containerID, svgTagID, detailsID,
			{
			createRectSVGElement: (data => { return svgElementController.createRectSVGElement(...data)}),
			appendSVG: (data => {svgElementController.appendSVG(...data)}),
			handleMouseDown: (data => {svgElementController.handleMouseDown(...data)}),
			showDetails: (data => {svgElementController.showDetails(...data)}),
			hideDetails: (data => {svgElementController.hideDetails(...data)})
		});
	}

	componentWillUnmount() {
		this.state.socket.close();
	}

	render() {
		const divW = size;
		const divH = size*.5;
		const svgW = divW*.5;
		const svgH = divH;

		return(
			<div>
				<div className="container-fluid noPadding">
					<div style={{width:divW, height:divH}}>
						<div className="row">
							<div className="col">
								<div style={{width:svgW, height:svgH}}>
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
									></svg></div>
								<input type="text" id="message" placeholder="Add message..."/>
								<button onClick={(e) => {
									const val = document.getElementById("message").value;
									svgElementController.handleNewSVGElementRequest(e, val, this);
									document.getElementById("message").value = "";
								}}>BUTTON</button>
							</div>
							<div className="col">
								<div style={{width: divW*.25, height: divH}}>
									<div id={detailsID}></div>
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