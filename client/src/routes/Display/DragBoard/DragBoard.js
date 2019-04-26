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
			xFrom: 0,
			yFrom: 0,
			draggedItem: "",
			isDragged: false,
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

			console.log("Received data: " + JSON.stringify(data));
			console.log("Extracted data: " + JSON.stringify(svgObj));
			
			this.setState((prev) => ({
				svgElements: Object.assign(svgElements, data)
			}));

			console.log(JSON.stringify(this.state.svgElements));
			this.appendSVG(this.createRectSVGElement(svgObj));
		});

		socket.on("serverReqSvg", (socketid) => {
			const {svgElements} = this.state;

			console.log("this.state.svgElemetns: " + JSON.stringify(this.state.svgElements));
			console.log("svgElements: " + JSON.stringify(svgElements));

			socket.emit("svgToServer", {
				jwt: this.props.jwt,
				socketid: socketid,
				svgElements: svgElements
			})
		});

		socket.on("svgToClient", (data) => {
			console.log("Recieved svg " + data);
			if(data && !this.state.updated){
				this.setState({
					svgElements: Object.assign(data),
					updated: true
				});
				console.log(data);
				Object.keys(data).forEach(key => {
					this.appendSVG(this.createRectSVGElement(data[key]));
				})
			}
		});

		socket.emit("svgCopyRequest", this.props.jwt);		

	}

	componentWillUnmount() {
		const {socket} = this.state;
		socket.close();
	}

	handleMouseDown(e,str) {
		if (!this.state.isDragged) {
			this.setState({
				xFrom: parseInt(e.pageX),
				yFrom: parseInt(e.pageY),
				draggedItem: str,
				isDragged: true
			});
		}
		const svgItem = document.getElementById("svgViewBox");
	}

	handleMouseMove(e) {
		const {isDragged, draggedItem, xFrom, yFrom} = this.state;
		if (isDragged) {
			const dx = e.pageX - xFrom;
			const dy = e.pageY - yFrom;

			this.setState({ xFrom: e.pageX, yFrom: e.pageY});
			
			const svgItem = document.getElementById("svgViewBox");
			const rect = svgItem.getElementById(draggedItem);
			
			const rectX = parseInt(rect.getAttribute("x"));
			const rectY = parseInt(rect.getAttribute("y"));

			rect.setAttributeNS(null, "x", (rectX + dx));
			rect.setAttributeNS(null, "y", (rectY + dy));
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
		const {draggedItem, svgElements} = this.state;
		
		for (var se in svgElements) {
			if (svgElements[se].id) {
				if (draggedItem === svgElements[se].id) {
					const dragged = document.getElementById("svgViewBox").getElementById(draggedItem);
					
					svgElements[se].x = parseInt(dragged.getAttributeNS(null, "x"));
					svgElements[se].y = parseInt(dragged.getAttributeNS(null, "y"));
				}
			}
		}
		this.setState({
			isDragged: false,
			svgElements: svgElements
		})
	}

	createRectSVGElement(data){
		console.log(data);
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
		document.getElementById("svgViewBox").appendChild(element);
	}


	render() {

		return(
			<div>
			<svg
				x="200"
				id="svgViewBox"
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