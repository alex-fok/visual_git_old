import React, {Component} from 'react';

class FileTreeNode extends Component{
	constructor(props) {
		super(props);
	}
	render() {
			return (
			<rect
				x={this.props.coordinate.x}
				y={this.props.coordinate.y}
				width="10"
				height="10"
				fill="#FF8000"
				data-toggle="modal"
				data-target="#details"
				onClick={()=> {this.props.setSelected(this.props.version)}}
				onContextMenu={(e)=> {
					document.getElementById("customMenu").style.display = "block";
					document.getElementById("customMenu").style.left = `${e.pageX - window.scrollX + 10}px`;
					document.getElementById("customMenu").style.top = `${e.pageY - window.scrollY + 10}px`;
					this.props.setSelected(this.props.version);
				}}/>	
		)
	}
}

export default FileTreeNode;