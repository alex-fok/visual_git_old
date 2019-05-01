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

		this.handleNewSVGElementRequest = this.handleNewSVGElementRequest.bind(this);
		this.createRectSVGElement = this.createRectSVGElement.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
	}

	componentDidMount() {
		svgElementController.initSocket(this, this.state.socket);
	}

	componentWillUnmount() {
		this.state.socket.close();
	}

	handleMouseDown(e,str) {
		if (!this.state.isDragging) {
			const px = parseInt(e.pageX);
			const py = parseInt(e.pageY);

			this.setState({
				draggedItem: {
					id: str,
					xFrom: px,
					yFrom: py 
				},
				isDragging: true
			});
		}
	}

	handleMouseMove(e) {
		if (this.state.isDragging) {
			const {draggedItem, socket} = this.state;
			const rect = document.getElementById("svgContainer").getElementById(draggedItem.id);

			const px = parseInt(e.pageX);
			const py = parseInt(e.pageY);
			const dx = px - draggedItem.xFrom;
			const dy = py - draggedItem.yFrom;

			this.setState(prev => ({
				draggedItem: Object.assign(prev.draggedItem, {xFrom: px, yFrom: py}) 
			}));
			
			const rectX = parseInt(rect.getAttributeNS(null, "x"));
			const rectY = parseInt(rect.getAttributeNS(null, "y"));

			rect.setAttributeNS(null, "x", (rectX + dx));
			rect.setAttributeNS(null, "y", (rectY + dy));

			socket.emit("moveSVG", {
				id: draggedItem.id,
				x: rectX + dx,
				y: rectY + dy,
				fill: "#F00"
			})
		}	
	}

	handleNewSVGElementRequest(e) {
		const id = "newItem" + Date.now();
		let data = {
			[id] : { 
				x: 10,
				y: 50,
				width: 10,
				height: 10,
				fill: "#FFF",
				id: "newItem" + Date.now(),
			}
		}
		const {socket} = this.state;
		socket.emit("createSVG", data);
	}

	notDragged(e) {

		if (this.state.isDragging){
			const {draggedItem, socket, svgElements} = this.state;
			const dragged = document.getElementById("svgContainer").getElementById(draggedItem.id);
			svgElements[draggedItem.id].y = parseInt(dragged.getAttributeNS(null, "y"));
			svgElements[draggedItem.id].x = parseInt(dragged.getAttributeNS(null, "x"));
		
			this.setState({
				draggedItem: {id: "", xFrom: 0, yFrom: 0},
				isDragging: false,
				svgElements: svgElements
			});
			socket.emit("releaseSvg", draggedItem.id);
		}
}

	createRectSVGElement(data){
		var rect = document.createElementNS(svgNS,"rect");
		rect.setAttributeNS(null, "id", data.id);
		rect.setAttributeNS(null, "x", parseInt(data.x));
		rect.setAttributeNS(null, "y", parseInt(data.y));
		rect.setAttributeNS(null, "width", parseInt(data.width));
		rect.setAttributeNS(null, "height", parseInt(data.height));
		rect.setAttributeNS(null, "fill", data.fill);
		rect.addEventListener("mousedown", (e)=>{this.handleMouseDown(e,data.id)});
		return rect;
	}

	appendSVG(element){
		document.getElementById("svgContainer").appendChild(element);
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
					onMouseMove={(e)=>this.handleMouseMove(e)}
					onMouseLeave={(e)=>this.notDragged(e)}
					onMouseUp={(e)=>this.notDragged(e)}
					style={{backgroundColor: "#000"}}
				>
				</svg>
				<button onClick={this.handleNewSVGElementRequest}>BUTTON</button>
			</div>
		);
	}
}

export default DragBoard;