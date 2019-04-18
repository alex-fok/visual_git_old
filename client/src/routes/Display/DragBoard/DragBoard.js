import React, {Component} from "react";
import ReactDOM from "react-dom";

class DragBoard extends Component {
	constructor(props) {
		super(props);
		this.state={
			xFrom: 0,
			yFrom: 0,
			draggedItem: "",
			isDragged: false
		}
	}

	handleMouseDown(e,str) {
		this.setState({
			xFrom: parseInt(e.pageX),
			yFrom: parseInt(e.pageY),
			draggedItem: str,
			isDragged: true
		})
	}

	handleMouseMove(e) {
		const {isDragged} = this.state;
		if (isDragged) {
			const dx = e.pageX - this.state.xFrom;
			const dy = e.pageY - this.state.yFrom;

			this.setState({
				xFrom: e.pageX,
				yFrom: e.pageY
			})

			const svgItem = document.getElementById("svgViewBox");
			const rect = svgItem.getElementById("moveable");
			
			const rectX = parseInt(rect.getAttribute("x"));
			const rectY = parseInt(rect.getAttribute("y"));

			rect.setAttributeNS(null, "x", (rectX + dx));
			rect.setAttributeNS(null, "y", (rectY + dy));
		}	
	}	

	handleMouseUp(e) {
		this.setState({
			isDragged: false
		})
	}

	// createNewRectSVGElement(old,x,y){
	// 	var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
	// 	rect.setAttributeNS(null, "x", 	x);
	// 	rect.setAttributeNS(null, "y", y);
	// 	rect.setAttributeNS(null, "width", parseInt(old.getAttribute("width")));
	// 	rect.setAttributeNS(null, "height", parseInt(old.getAttribute("height")));
	// 	rect.setAttributeNS(null, "fill", old.getAttribute("fill"));
	// 	rect.setAttributeNS(null, "id", old.getAttribute("id"));
	// 	rect.setAttributeNS(null, "onMouseDown", old.getAttribute("onMouseDown"));
	// 	old.remove();
	// 	document.getElementById("svgViewBox").appendChild(rect);
	// 
	// }


	render() {

		return(
			<svg
				x="200"
				id="svgViewBox"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100"
				width="100"
				height="100"
				onMouseMove={(e)=>this.handleMouseMove(e)}
				style={{backgroundColor: "#000"}}
			>
				<rect
					id="moveable"
					onMouseDown={(e)=>this.handleMouseDown(e,"moveable")}
					onMouseUp={(e)=>this.handleMouseUp(e)}
					x="30"
					y="30"
					width="10"
					height="10"
					fill="#FFF"
				/>
			</svg>
		);
	}
}

export default DragBoard;