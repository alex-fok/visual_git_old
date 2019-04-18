import React, {Component} from "react";
import ReactDOM from "react-dom";

class DragBoard extends Component {
	constructor(props) {
		super(props);
		this.state={
			dx: 0,
			dy: 0
		}
	}

	handleClick() {
		console.log("Clicked");
	}

	handleMouseDown(e,str) {
		this.setState({
			xFrom: e.pageX,
			yFrom: e.pageY
		})
	}

	handleMouseUp(e) {
		
		const dx = parseInt(e.pageX - this.state.xFrom);
		const dy = parseInt(e.pageY - this.state.yFrom);
		console.log("X distance: " + dx);
		console.log("Y distance: " + dy);

		const svgItem = document.getElementById("svgViewBox");
		const oldRect = svgItem.getElementById("moveable");
		
		const rectX = parseInt(oldRect.getAttribute("x"));
		const rectY = parseInt(oldRect.getAttribute("y"));
		
		this.createNewRectSVGElement(oldRect, rectX + dx, rectY + dy)
	}

	createNewRectSVGElement(old,x,y){
		var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
		rect.setAttributeNS(null, "x", 	x);
		rect.setAttributeNS(null, "y", y);
		rect.setAttributeNS(null, "width", parseInt(old.getAttribute("width")));
		rect.setAttributeNS(null, "height", parseInt(old.getAttribute("height")));
		rect.setAttributeNS(null, "fill", old.getAttribute("fill"));
		rect.setAttributeNS(null, "id", old.getAttribute("id"));
		rect.setAttributeNS(null, "onMouseDown", old.getAttribute("onMouseDown"));
		
		document.getElementById("svgViewBox").appendChild(rect);
	}

	render() {

		return(
			<svg
				x="200"
				id="svgViewBox"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100"
				width="100"
				height="100"
				onMouseUp={(e)=>this.handleMouseUp(e, "bbb")}
				style={{backgroundColor: "#000"}}
			>
				
				<rect
					id="moveable"
					onMouseDown={(e)=>this.handleMouseDown(e,"bbb")}
					
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