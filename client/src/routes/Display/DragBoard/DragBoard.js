import React, {Component} from "react";
import ReactDOM from "react-dom";

class DragBoard extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log("Constructing board");
		return(
			<svg
				viewBox="0 0 100 100"
				xmlns="http://www.w3.org/2000/svg"

				>
				<rect x="0" y="0" width="100" height="100" fill="#000"/>
				<rect x="30" y="30" width="4" height="4" fill="#FFF"/>
			</svg>
		);
	}
}

export default DragBoard;