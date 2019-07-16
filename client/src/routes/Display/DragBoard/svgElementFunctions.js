const svgNS = "http://www.w3.org/2000/svg",
	  htmlNS = "http://www.w3.org/1999/xhtml";
const $ = (id) => {return document.getElementById(id)};

export default {
	// createRectSVGElement: (attributes, svgObjTagID, fnList, obj) => {
	// 	var rect = document.createElementNS(svgNS,"rect");
	// 	rect.setAttributeNS(null, "id", attributes.id);
	// 	rect.setAttributeNS(null, "x", parseInt(attributes.x));
	// 	rect.setAttributeNS(null, "y", parseInt(attributes.y));
	// 	rect.setAttributeNS(null, "width", parseInt(attributes.width));
	// 	rect.setAttributeNS(null, "height", parseInt(attributes.height));
	// 	rect.setAttributeNS(null, "fill", attributes.fill);
	// 	rect.addEventListener("mousedown", (e)=>{fnList.handleMouseDown(e, attributes.id, obj)});
	// 	rect.addEventListener("mouseover", (e)=>{fnList.showTag(e, attributes.id, obj, svgObjTagID)});
	// 	rect.addEventListener("mousemove", (e)=>{fnList.showTag(e, attributes.id, obj, svgObjTagID)});
	// 	rect.addEventListener("mouseleave", (e)=>{fnList.hideTag(svgObjTagID)});
	// 	rect.addEventListener("click", (e)=>{fnList.showDetails(attributes.id, obj)})
	// 	return rect;
	// },

	// appendSVG: (element, containerID) => {
	// 	$(containerID).appendChild(element);
	// },

	// showDetails: (str, obj) => {
	// 	const {msg, img} = obj.state.svgElements[str];
	// 	obj.setState({
	// 		selectedItem: {
	// 			msg: msg,
	// 			img: img
	// 		},
	// 		isInput: false
	// 	})},

	showTag: (e, msg, svgObjTagID, dragging) => {
		if (!dragging) {
			$(svgObjTagID).innerHTML = msg;			
			$(svgObjTagID).style.display = "block";
			$(svgObjTagID).style.left = `${e.pageX - window.scrollX + 15}px`;
			$(svgObjTagID).style.top = `${e.pageY - window.scrollY}px`;
		} else {
			$(svgObjTagID).style.display = "none";;
		}
	},

	hideTag: (svgObjTagID) => {
		$(svgObjTagID).style.display = "none";
	},

	// handleMouseDown: (e,str, obj) => {
	// 	if (!obj.state.isDragging) {
	// 		const px = parseInt(e.pageX);
	// 		const py = parseInt(e.pageY);

	// 		obj.setState({
	// 			draggedItem: {
	// 				id: str,
	// 				xFrom: px,
	// 				yFrom: py 
	// 			},
	// 			isDragging: true
	// 		});
	// 	}
	// },

	handleNewSVGElementRequest: (input, socket) => {
		const id = "item_" + Date.now();
		let data = {
			[id] : {
				msg: input.msg,
				img: input.img	,
				x: 10,
				y: 50,
				width: 10,
				height: 10,
				fill: "#FFF",
				id: id
			}
		}
		socket.emit("createSVG", data);
	},

	handleEditRequest: (original, input, socket) => {
		const id = original.id;
		let data = {
			[id] : Object.assign(original, {msg: input.msg, img: input.img})
		};
		socket.emit("editSVG", data);
	},

	// handleMouseMove: (e, obj, containerID) => {
	// 	if (obj.state.isDragging) {
	// 		const {draggedItem, socket} = obj.state;
	// 		const rect = $(containerID).getElementById(draggedItem.id),
	// 					px = parseInt(e.pageX),
	// 					py = parseInt(e.pageY),
	// 					dx = px - draggedItem.xFrom,
	// 					dy = py - draggedItem.yFrom;

	// 		obj.setState(prev => ({
	// 			draggedItem: Object.assign(prev.draggedItem, {xFrom: px, yFrom: py}) 
	// 		}));
			
	// 		const rectX = parseInt(rect.getAttributeNS(null, "x")),
	// 					rectY = parseInt(rect.getAttributeNS(null, "y"));

	// 		rect.setAttributeNS(null, "x", (rectX + dx));
	// 		rect.setAttributeNS(null, "y", (rectY + dy));

	// 		socket.emit("moveSVG", {
	// 			id: draggedItem.id,
	// 			x: rectX + dx,
	// 			y: rectY + dy,
	// 			fill: "#F00"
	// 		})
	// 	}
	// },

	// notDragged: (e, obj, containerID) => {
	// 	if (obj.state.isDragging){
	// 		const {draggedItem, socket, svgElements} = obj.state;
	// 		const dragged = $(containerID).getElementById(draggedItem.id);
	// 		svgElements[draggedItem.id].y = parseInt(dragged.getAttributeNS(null, "y"));
	// 		svgElements[draggedItem.id].x = parseInt(dragged.getAttributeNS(null, "x"));
		
	// 		obj.setState({
	// 			draggedItem: {id: "", xFrom: 0, yFrom: 0},
	// 			isDragging: false,
	// 			svgElements: svgElements
	// 		});
	// 		socket.emit("releaseSvg", draggedItem.id);
	// 	}
	// },
}