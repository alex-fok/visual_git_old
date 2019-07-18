import React, {Component} from 'react';

class FileVersionTree extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {fileData} = this.props;
		return (
			<div style={{width: "1200px", height: "600px"}}>
			<svg
				viewBox={`0 0 400 400`}
				width="100%"
				height="100%"
				style={{backgroundColor: "#CCC"}}
			/>
			</div>
		)
	}
}

export default FileVersionTree;