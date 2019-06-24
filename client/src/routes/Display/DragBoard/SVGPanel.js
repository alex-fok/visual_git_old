import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class SVGPanel extends Component {
	constructor(props) {
		super(props);
	};

	render() {
		const {dimension, idOfSVGs} = this.props;
		return (
			<div style={{width: dimension.width, height: dimension.height}}>
				<svg
					id={idOfSVGs.svgElementID}
					viewBox={`0 0 ${dimension.width} ${dimension.height}`}
					width="100%"
					height="100%"
					style={{backgroundColor: "#999"}}
				>		
				</svg>
			</div>
		);
	}
}
export default SVGPanel;