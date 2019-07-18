import React, {Component} from 'react';

class FileVersionTree extends Component {
	constructor(props) {
		super(props);
		this.showDetails = this.showDetails.bind(this);
	}

	showDetails() {
		console.log("showDetails clicked");
	}
	render() {
		const {fileData} = this.props;
		return (
			<div style={{width: "1200px", height: "600px"}}>
			<svg
				viewBox={`0 0 1200 600`}
				width="100%"
				height="100%"
				style={{backgroundColor: "#F5F5F5"}}
			>
			<rect 
				x="100"
				y="200"
				width="40"
				height="40"
				fill="#FF8000"
				onClick={this.showDetails}
			/>
			</svg>
			</div>
		)
	}
}

export default FileVersionTree;