const svgNS = "http://www.w3.org/2000/svg";
const $ = (id) => {return document.getElementById(id)};

export default {
	initSocket: (obj, idList, fnList) => {
		console.log("initSocket: idList.infoIDs : " + JSON.stringify(idList.infoIDs));
		const {socket} = obj.state;

		socket.on("svgAdd", (data) => {
			let {svgElements} = obj.state;
			let svgObj = data[Object.keys(data)[0]];

			obj.setState(prev => ({
				svgElements: Object.assign(svgElements, data)
			}));
			fnList.appendSVG([fnList.createRectSVGElement([svgObj, idList.infoIDs, {
				handleMouseDown: fnList.handleMouseDown,
				showTag: fnList.showTag,
				hideTag: fnList.hideTag,
				showDetails: fnList.showDetails
			}, obj]), idList.containerID]);
		});

		socket.on("svgMove", (data) => {
			const {id, x, y, fill} = data;
			const rect = $(idList.containerID).getElementById(id);
			rect.setAttributeNS(null, "x", parseInt(x));
			rect.setAttributeNS(null, "y", parseInt(y));
			rect.setAttributeNS(null, "fill", fill);
		});

		socket.on("svgReleased", (id) => {
			const rect = $(idList.containerID).getElementById(id);
			rect.setAttributeNS(null, "fill", "#FFF");
			obj.setState(prev => ({
				svgElements: Object.assign(prev.svgElements, {[id]: Object.assign(prev.svgElements[id], {x: rect.x, y: rect.y})})
			}));
		})

		// Return the current SVG map to server
		socket.on("serverReqSvg", (socketid) => {
			const {svgElements} = obj.state;

			socket.emit("svgToServer", {
				jwt: obj.props.jwt,
				socketid: socketid,
				svgElements: svgElements
			})
		});

		// Receive the SVG map from server on init
		socket.on("svgToClient", (data) => {
			if(data && !obj.state.updated) {
				obj.setState({
					svgElements: Object.assign(data),
					updated: true
				});
				Object.keys(data).forEach(key => {
					fnList.appendSVG([fnList.createRectSVGElement([data[key], idList.infoIDs,
					{
					handleMouseDown: fnList.handleMouseDown,
					showTag: fnList.showTag,
					hideTag: fnList.hideTag,
					showDetails: fnList.showDetails
					}, obj]), idList.containerID]);
				})
			}
		});

		socket.emit("svgCopyRequest", obj.props.jwt);
	},

	createRectSVGElement: (attributes, infoIDs, fnList, obj) => {
		var rect = document.createElementNS(svgNS,"rect");
		rect.setAttributeNS(null, "id", attributes.id);
		rect.setAttributeNS(null, "x", parseInt(attributes.x));
		rect.setAttributeNS(null, "y", parseInt(attributes.y));
		rect.setAttributeNS(null, "width", parseInt(attributes.width));
		rect.setAttributeNS(null, "height", parseInt(attributes.height));
		rect.setAttributeNS(null, "fill", attributes.fill);
		rect.addEventListener("mousedown", (e)=>{fnList.handleMouseDown([e, attributes.id, obj])});
		rect.addEventListener("mouseover", (e)=>{fnList.showTag([e, attributes.id, obj, infoIDs.svgTagID, infoIDs.detailsID])});
		rect.addEventListener("mousemove", (e)=>{fnList.showTag([e, attributes.id, obj, infoIDs.svgTagID, infoIDs.detailsID])});
		rect.addEventListener("mouseleave", (e)=>{fnList.hideTag([infoIDs.svgTagID])});
		rect.addEventListener("click", (e)=>{fnList.showDetails([attributes.id, obj, infoIDs.detailsID, infoIDs.detailsContentID])})
		return rect;
	},

	appendSVG: (element, containerID) => {
		$(containerID).appendChild(element);
	},

	showDetails: (str, obj, detailsID, detailsContentID) => {
		$("details-content").innerHTML = `${obj.state.svgElements[str].msg}`;
		$(detailsID).style.display = "block";
},

	hideDescription: (detailsID) => {
		$(detailsID).style.display = "none"
	},

	showTag: (e, str, obj, svgTagID, detailsID) => {
		if (!obj.state.isDragging) {
			$(svgTagID).innerHTML = obj.state.svgElements[str].msg;
			$(svgTagID).style.display = "block";
			$(svgTagID).style.left = `${e.pageX + 15}px`;
			$(svgTagID).style.top = `${e.pageY}px`;
		} else {
			$(svgTagID).style.display = "none";
			$(detailsID).style.display = "none";
		}
	},

	hideTag: (svgTagID, detailsID) => {
		$(svgTagID).style.display = "none";
	},

	handleMouseDown: (e,str, obj) => {
		if (!obj.state.isDragging) {
			const px = parseInt(e.pageX);
			const py = parseInt(e.pageY);

			obj.setState({
				draggedItem: {
					id: str,
					xFrom: px,
					yFrom: py 
				},
				isDragging: true
			});
		}
	},

	handleNewSVGElementRequest: (e, msg, obj) => {
		const id = "newItem" + Date.now();
		let data = {
			[id] : {
				msg: msg, 
				x: 10,
				y: 50,
				width: 10,
				height: 10,
				fill: "#FFF",
				id: "newItem" + Date.now(),
			}
		}
		const {socket} = obj.state;
		socket.emit("createSVG", data);
	},

	handleMouseMove: (e, obj, containerID) => {
		if (obj.state.isDragging) {
			const {draggedItem, socket} = obj.state;
			const rect = $(containerID).getElementById(draggedItem.id);

			const px = parseInt(e.pageX);
			const py = parseInt(e.pageY);
			const dx = px - draggedItem.xFrom;
			const dy = py - draggedItem.yFrom;

			obj.setState(prev => ({
				draggedItem: Object.assign(prev.draggedItem, {xFrom: px, yFrom: py}) 
			}));
			
			const rectX = parseInt(rect.getAttributeNS(null, "x"));
			const rectY = parseInt(rect.getAttributeNS(null, "y"));

			rect.setAttributeNS(null, "x", (rectX + dx));
			rect.setAttributeNS(null, "y", (rectY + dy));

			socket.emit("moveSVG", {
				id: draggedItem.id,
				x: rectX + dx,
				y: rectY + dy,
				fill: "#F00"
			})
		}
	},

	notDragged: (e, obj, containerID) => {
		if (obj.state.isDragging){
			const {draggedItem, socket, svgElements} = obj.state;
			const dragged = $(containerID).getElementById(draggedItem.id);
			svgElements[draggedItem.id].y = parseInt(dragged.getAttributeNS(null, "y"));
			svgElements[draggedItem.id].x = parseInt(dragged.getAttributeNS(null, "x"));
		
			obj.setState({
				draggedItem: {id: "", xFrom: 0, yFrom: 0},
				isDragging: false,
				svgElements: svgElements
			});
			socket.emit("releaseSvg", draggedItem.id);
		}
	}
}