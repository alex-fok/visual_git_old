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
					x="200"
					id="svgContainer"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 300 300"
					width="300"
					height="300"
					onMouseMove={(e)=>svgElementController.handleMouseMove(e, this)}
					onMouseLeave={(e)=>svgElementController.notDragged(e, this)}
					onMouseUp={(e)=>svgElementController.notDragged(e, this)}
					style={{backgroundColor: "#000"}}
				>
				</svg>
				<button onClick={(e) => {svgElementController.handleNewSVGElementRequest(e, this)}}>BUTTON</button>
			</div>
		);
	}
}

export default DragBoard;