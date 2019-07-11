import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import svgElementFunctions from './svgElementFunctions';

class SVGPanel extends Component {
	constructor(props) {
		super(props);
	};

	componentDidMount() {
		const {svgElements} = this.props;
		Object.keys(data).forEach(key => {
	    svgElementFunctions.appendSVG(svgElementFunctions.createRectSVGElement(data[key], idList.infoIDs,
	    {
	      handleMouseDown: svgElementFunctions.handleMouseDown,
	      showTag: svgElementFunctions.showTag,
	      hideTag: svgElementFunctions.hideTag,
	      showDetails: svgElementFunctions.showDetails
	    }, obj), "svgElementID");
	  });
	}

	render() {
		const {dimension, svgElementID} = this.props;
		return (
			<div style={{width: dimension.width, height: dimension.height}}>
				<svg
					id={svgElementID}
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