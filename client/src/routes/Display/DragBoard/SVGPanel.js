import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import svgElementFunctions from './svgElementFunctions';

const $ = (id) => {return document.getElementById(id)};

class SVGPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			svgElements: {},
      draggedItem: {
        id: "",
        xFrom: 0,
        yFrom: 0
      },
      isDragging: false,
      updated: false
		}
		this.startDragging = this.startDragging.bind(this);
		this.handleDragging = this.handleDragging.bind(this);
		this.endDragging = this.endDragging.bind(this);
	}

	componentDidMount() {
		const {socket} = this.props;
		const {svgElements} = this.state;

		socket.on("svgAdd", (data)=> {
			this.setState({
				svgElements: Object.assign(svgElements, data)
			});
		});

		socket.on("svgEdit", (data)=> {
			const {selectedItem,setSelectedItem} = this.props;
			this.setState({
				svgElements: Object.assign(svgElements, data)
			});
			const key = Object.keys(data)[0];
			if (data[key].id === selectedItem.id) {
				setSelectedItem(data[key]);
			}
		})

		socket.on("svgMove", (data)=> {
			this.setState(prev => ({
				svgElements: Object.assign(prev.svgElements, 
					{[data.id] : Object.assign(svgElements[data.id], {x: data.x, y: data.y})}
			)}));
		});

		socket.on("svgReleased", (id)=> {document.getElementById(id).fill = "#FFF"});

		socket.on("serverReqSvg", (socketid)=> {
			socket.emit("svgToServer", {
				jwt: this.props.jwt,
				socketid: socketid,
				svgElements: svgElements
			})
		});

		socket.on("svgToClient", (data) => {
			if(data && !this.state.updated) {
				this.setState({
					svgElements: Object.assign(data),
					updated: true
				});
			}
		});

		socket.emit("svgCopyRequest", this.props.jwt)
	}

	startDragging(e, id) {
    if (!this.state.isDragging) {
      const px = parseInt(e.pageX);
      const py = parseInt(e.pageY);

      this.setState({
        draggedItem: {
          id: id,
          xFrom: px,
          yFrom: py 
        },
        isDragging: true
      });
    }
  }

  handleDragging(e) {
		if (this.state.isDragging) {
			const {draggedItem, svgElements} = this.state;
			const {socket} = this.props;

			const rect = svgElements[draggedItem.id],
						px = parseInt(e.pageX),
						py = parseInt(e.pageY),
						dx = px - draggedItem.xFrom,
						dy = py - draggedItem.yFrom;
			
			this.setState(prev => ({
				svgElements: Object.assign(svgElements, {[draggedItem.id] : Object.assign(svgElements[draggedItem.id], {x: rect.x + dx, y: rect.y + dy})}),
				draggedItem: Object.assign(prev.draggedItem, {xFrom: px, yFrom: py}) 
			}));

			socket.emit("moveSVG", {
				id: draggedItem.id,
				x: rect.x + dx,
				y: rect.y + dy,
				fill: "#F00"
			})
		}
	}

	endDragging() {
		if (this.state.isDragging){		
			this.setState({
				draggedItem: {id: "", xFrom: 0, yFrom: 0},
				isDragging: false,
			});
			this.props.socket.emit("releaseSvg", this.state.draggedItem.id);
		}
	}

	render() {
		const {svgElements} = this.state;
		const {dimension, svgElementID, svgObjTagID} = this.props;
		const {showTag, hideTag} = svgElementFunctions;
		return (
			<div style={{width: dimension.width, height: dimension.height}}>
				<svg
					id={svgElementID}
					viewBox={`0 0 ${dimension.width} ${dimension.height}`}
					width="100%"
					height="100%"
					style={{backgroundColor: "#999"}}
					onMouseMove={(e) => {this.handleDragging(e)}}
					onMouseLeave={(e)=> {this.endDragging()}}
					onMouseUp={(e)=> {this.endDragging()}}
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
							onMouseDown={(e)=> this.startDragging(e,key)}
							onMouseOver={(e)=> showTag(e, rect.msg, this.props.svgObjTagID, this.state.isDragging)}
							onMouseMove={(e)=> showTag(e, rect.msg, this.props.svgObjTagID, this.state.isDragging)}
							onMouseLeave={(e)=> hideTag(svgObjTagID)}
							onClick={(e)=> this.props.setSelectedItem(rect)}
						/>
					)
					})}
				</svg>
			</div>
		);
	}
}
export default SVGPanel;