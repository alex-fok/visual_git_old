import React, {Component} from 'react';

class Arrow extends Component {
	constructor(props){
		super(props);
	}

	render() {
		const {type, src, dest, s_size, d_size} = this.props;

		const end = {
			x: parseInt(dest.x),
			y: parseInt(dest.y) + parseInt(d_size)*.5
		}

		const start = type === "P2C" ?
			{
				x: parseInt(src.x) + parseInt(s_size)*.5,
				y: parseInt(src.y) + parseInt(s_size)
			}
		: // type M2M
			{
				x: parseInt(src.x) + parseInt(s_size),
				y: parseInt(src.y) + parseInt(s_size)*.5
			}

		return (
			<polyline 
				points={
					`${start.x},${start.y} ${type==="P2C" ? `${start.x},${end.y}` : ""} ${end.x},${end.y}`
				}
				fill="none"
				stroke="black"
				strokeWidth = ".3"
				
			/>
		)
	}
}
export default Arrow;