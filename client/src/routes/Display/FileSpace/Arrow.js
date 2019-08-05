import React, {Component} from 'react';

class Arrow extends Component {
	constructor(props){
		super(props);
	}

	render() {
		const {type, src, dest, sSize, dSize} = this.props;

		const end = {
			x: parseInt(dest.x),
			y: parseInt(dest.y) + parseInt(dSize)*.5
		}

		const start = type === "M2S" ?
			{
				x: parseInt(src.x) + parseInt(sSize)*.5,
				y: parseInt(src.y) + parseInt(sSize)
			}
		: // type M2M
			{
				x: parseInt(src.x) + parseInt(sSize),
				y: parseInt(src.y) + parseInt(sSize)*.5
			}

		return (
			<g stroke="black" strokeWidth = ".3">
				<polyline 
					fill="none"
					points={
						`
						${start.x},${start.y} 
						${type==="M2S" ? `${start.x},${end.y}` : ""} 
						${end.x},${end.y}
						`
					}					
				/>
				<polyline
					fill="black"
					points={
						`
						${end.x},${end.y}
						${end.x-dSize*.2},${end.y-dSize*.2}
						${end.x-dSize*.1},${end.y}
						${end.x-dSize*.2},${end.y+dSize*.2}
						`
					}
				/>
			</g>
		)
	}
}
export default Arrow;