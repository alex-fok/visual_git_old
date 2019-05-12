import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';
import svgElementController from './svgElementController';
import './DragBoard.css';

const svgNS = "http://www.w3.org/2000/svg";
const containerID = "svgContainer";

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
		svgElementController.initSocket(this, this.state.socket, containerID, {
			createRectSVGElement: (data => { return svgElementController.createRectSVGElement(...data)}),
			appendSVG: (data => {svgElementController.appendSVG(...data)}),
			handleMouseDown: (data => {svgElementController.handleMouseDown(...data)}),
			handleMouseOver: (data => {svgElementController.handleMouseOver(...data)})
		});
	}

	componentWillUnmount() {
		this.state.socket.close();
	}

	render() {
		const divW = 400;
		const divH = 400;
		const svgW = divW*.5;
		const svgH = divH*.5;

		return(
			<div>
				<div id="messageBox" className="message">test</div>
				<div style={{width:divW, height:divH}}>
					
					<div style={{width:svgW*.75, height:svgH*.75}}>
						<svg
							id={containerID}
							xmlns={svgNS}
							viewBox={`0 0 ${svgW*.75} ${svgH*.75}`}
							width="100%"
							height="100%"
							onMouseMove={(e)=>svgElementController.handleMouseMove(e, this, containerID)}
							onMouseLeave={(e)=>svgElementController.notDragged(e, this, containerID)}
							onMouseUp={(e)=>svgElementController.notDragged(e, this, containerID)}
							style={{backgroundColor: "#999"}}
						>
						</svg>
					</div>
					<input type="text" id="message" placeholder="Add message..."/>
					<button onClick={(e) => {
						const val = document.getElementById("message").value;
						svgElementController.handleNewSVGElementRequest(e, val, this);
						document.getElementById("message").value = "";
					}}>BUTTON</button>
				</div>
			</div>
		);
	}
}

export default DragBoard;