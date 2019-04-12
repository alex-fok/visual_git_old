import React, {Component} from "react";
import ReactDOM from "react-dom";

class DragBoard extends Component {
	constructor(props) {
		super(props);
		this.state={

		}
	}

	componentDidMount() {
		document.getElementById("moveable")
	}

	handleClick() {
		console.log("Clicked");
	}

	handleMouseDown(e) {
		console.log("X position: " + e.pageX);
		console.log("Y position: "+ e.pageY);

	}

	render() {
		return(
			<svg
				viewBox="0 0 100 100"
				xmlns="http://www.w3.org/2000/svg"

				>
				<rect x="0" y="0" width="100" height="100" fill="#000"/>
				<rect
					id="moveable"
					onMouseDown={this.handleMouseDown}
					x="30"
					y="30"
					width="4"
					height="4"
					fill="#FFF"
				/>
			</svg>
		);
	}
}

export default DragBoard;