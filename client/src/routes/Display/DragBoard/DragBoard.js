import React, {Component} from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';


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
		const {socket} = this.state;

		socket.on("svgAdd", (data) => {
			let {svgElements} = this.state;
			let svgObj = data[Object.keys(data)[0]];

			this.setState(prev => ({
				svgElements: Object.assign(svgElements, data)
			}));
			this.appendSVG(this.createRectSVGElement(svgObj));
		});

		socket.on("svgMoved", (data) => {
			const {id, x, y, fill} = data;
			const rect = document.getElementById("svgContainer").getElementById(id);
			console.log("svgMoved receieved: " + JSON.stringify(data));
			rect.setAttributeNS(null, "x", x);
			rect.setAttributeNS(null, "y", y);
			rect.setAttributeNS(null, "fill", fill);
		});

		socket.on("svgReleased", (id) => {
			const rect = document.getElementById("svgContainer").getElementById(id);
			rect.setAttributeNS(null, "fill", "#FFF");
		})

		// Return the current SVG map to server
		socket.on("serverReqSvg", (socketid) => {
			const {svgElements} = this.state;

			socket.emit("svgToServer", {
				jwt: this.props.jwt,
				socketid: socketid,
				svgElements: svgElements
			})
		});

		// Receive the SVG map from server on init
		socket.on("svgToClient", (data) => {
			if(data && !this.state.updated) {
				this.setState({
					svgElements: Object.assign(data),
					updated: true
				});
				Object.keys(data).forEach(key => {
					this.appendSVG(this.createRectSVGElement(data[key]));
				})
			}
		});

		// When init, send an request to server, server will
		// request for a SVG map from other users
		socket.emit("svgCopyRequest", this.props.jwt);		
	}

	componentWillUnmount() {
		const {socket} = this.state;
		socket.close();
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
		if (this.state.isDragging) {
			const {draggedItem, svgElements, socket} = this.state;
			const svg = svgElements[draggedItem.id];		
			const dragged = document.getElementById("svgContainer").getElementById(draggedItem.id);
			
			svgElements[draggedItem.id].x = parseInt(dragged.getAttributeNS(null, "x"));
			svgElements[draggedItem.id].y = parseInt(dragged.getAttributeNS(null, "y"));
		
			this.setState({
				draggedItem: {
					id: "",
					xFrom: 0,
					yFrom: 0
				},
				isDragging: false,
				svgElements: svgElements
			});

			socket.emit("releaseSvg", draggedItem.id)
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
		rect.addEventListener("mouseup", (e)=>{this.notDragged(e)});
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
				viewBox="0 0 100 100"
				width="100"
				height="100"
				onMouseMove={(e)=>this.handleMouseMove(e)}
				onMouseLeave={(e)=>this.notDragged(e)}
				style={{backgroundColor: "#000"}}
			>
				{// <rect
				// 	id="moveable"
				// 	onMouseDown={(e)=>this.handleMouseDown(e,"moveable")}
				// 	onMouseUp={(e)=>this.notDragged(e)}
				// 	x="30"
				// 	y="30"
				// 	width="10"
				// 	height="10"
				// 	fill="#FFF"
				// />
				}
			</svg>
			<button onClick={this.handleNewSVGElementRequest}>BUTTON</button>
			</div>
		);
	}
}

export default DragBoard;