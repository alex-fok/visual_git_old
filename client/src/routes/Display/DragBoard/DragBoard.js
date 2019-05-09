import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';
import svgElementController from './svgElementController';
import './DragBoard.css'

const svgNS = "http://www.w3.org/2000/svg";
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

		//this.handleNewSVGElementRequest = this.handleNewSVGElementRequest.bind(this);
	}

	componentDidMount() {
		svgElementController.initSocket(this, this.state.socket, {
			createRectSVGElement: ((data, callback, obj) => { return svgElementController.createRectSVGElement(data, callback, obj)}),
			appendSVG: ((element) => {svgElementController.appendSVG(element)}),
			handleMouseDown: ((e, str, obj) => {svgElementController.handleMouseDown(e, str, obj)}),
			handleMouseOver: ((e, str, obj) => {svgElementController.handleMouseOver(e, str, obj)})
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
				<div id="descriptionBox"></div>
				<div style={{width:divW, height:divH}}>
					
					<div style={{width:svgW*.75, height:svgH*.75}}>
						<svg
							id="svgContainer"
							xmlns={svgNS}
							viewBox={`0 0 ${svgW*.75} ${svgH*.75}`}
							width="100%"
							height="100%"
							onMouseMove={(e)=>svgElementController.handleMouseMove(e, this)}
							onMouseLeave={(e)=>svgElementController.notDragged(e, this)}
							onMouseUp={(e)=>svgElementController.notDragged(e, this)}
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