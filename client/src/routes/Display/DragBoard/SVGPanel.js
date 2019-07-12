import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import svgElementFunctions from './svgElementFunctions';

class SVGPanel extends Component {
	constructor(props) {
		super(props);
	};

	render() {
		const {dimension, svgElementID, svgElements, svgObjTagID, isDragging} = this.props;
		const {handleMouseDown, showTag, hideTag, showDetails} = svgElementFunctions;
		return (
			<div style={{width: dimension.width, height: dimension.height}}>
				<svg
					id={svgElementID}
					viewBox={`0 0 ${dimension.width} ${dimension.height}`}
					width="100%"
					height="100%"
					style={{backgroundColor: "#999"}}
				>
				{
					Object.keys(svgElements).map(key => {
					let rect = svgElements[key];
					return (
						<rect
							key={rect.id}
							id={rect.id}
							x={parseInt(rect.x)}
							y={parseInt(rect.y)}
							width={parseInt(rect.width)}
							height={parseInt(rect.height)}
							fill={rect.fill}
							//onMouseDown={(e)=> handleMouseDown(e)}
							onMouseOver={(e)=> showTag(e, rect.msg, this.props.svgObjTagID, isDragging)}
							onMouseMove={(e)=> showTag(e, rect.msg, this.props.svgObjTagID, isDragging)}
							onMouseLeave={(e)=> hideTag(svgObjTagID)}
							onClick={(e)=> this.props.setSelectedItem(rect.msg, rect.img)}
						/>
					)
					})}
				</svg>
			</div>
		);
	}
}
export default SVGPanel;