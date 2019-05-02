import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';
import svgElementController from './svgElementController'

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
			handleMouseDown: ((e, str, obj) => {svgElementController.handleMouseDown(e, str, obj)})
		});
	}

	componentWillUnmount() {
		this.state.socket.close();
	}

	render() {

		return(
			<div>
					<svg
						id="svgContainer"
						xmlns={svgNS}
						viewBox="0 0 800 800"
						width="800"
						height="800"
						onMouseMove={(e)=>svgElementController.handleMouseMove(e, this)}
						onMouseLeave={(e)=>svgElementController.notDragged(e, this)}
						onMouseUp={(e)=>svgElementController.notDragged(e, this)}
						style={{backgroundColor: "#999"}}
					>
					<rect 
						x="0"
						y="0"
						width="800"
						height="50"
						fill="#CCC"
					>
					</rect>
						<g
							fill="#CCC"
							strokeWidth="1"
							stroke="#000"
							strokeDasharray="1"
						>
						<rect
							x="10"
							y="7.5"
							width="70"
							height="30"
						>
						</rect>
						</g>
						<text 
							x="20"
							y="27"
							fill="#000">Option
						</text>
					</svg>
				<button onClick={(e) => {svgElementController.handleNewSVGElementRequest(e, this)}}>BUTTON</button>
			</div>
		);
	}
}

export default DragBoard;