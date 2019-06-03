import svgElementFunctions from './svgElementFunctions';

const svgNS = "http://www.w3.org/2000/svg";
const htmlNS = "http://www.w3.org/1999/xhtml";
const $ = (id) => {return document.getElementById(id)};

export default {
	initSocket: (obj, idList) => {
		console.log("initSocket: idList.infoIDs : " + JSON.stringify(idList.infoIDs));
		const {socket} = obj.state;

		socket.on("svgAdd", (data) => {
			let {svgElements} = obj.state;
			let svgObj = data[Object.keys(data)[0]];

			obj.setState(prev => ({
				svgElements: Object.assign(svgElements, data)
			}));
			svgElementFunctions.appendSVG(svgElementFunctions.createRectSVGElement(svgObj, idList.infoIDs, {
				handleMouseDown: svgElementFunctions.handleMouseDown,
				showTag: svgElementFunctions.showTag,
				hideTag: svgElementFunctions.hideTag,
				showDetails: svgElementFunctions.showDetails
			}, obj), idList.svgElementID);
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
					svgElementFunctions.appendSVG(svgElementFunctions.createRectSVGElement(data[key], idList.infoIDs,
					{
					handleMouseDown: svgElementFunctions.handleMouseDown,
					showTag: svgElementFunctions.showTag,
					hideTag: svgElementFunctions.hideTag,
					showDetails: svgElementFunctions.showDetails
					}, obj), idList.svgElementID);
				})
			}
		});

		socket.emit("svgCopyRequest", obj.props.jwt);
	},

	initDisplay: (idList, dimension, obj) => {
		const {w, h} = dimension;
		const {svgContainerID, svgElementID, messageInputID, addButtonID} = idList;
		var svg = document.createElementNS(svgNS, "svg");
		svg.setAttributeNS(null, "id", svgElementID);
		svg.setAttributeNS(null, "viewBox", `0 0 ${w} ${h}`);
		svg.setAttributeNS(null, "width", "100%");
		svg.setAttributeNS(null, "height", "100%");
		svg.style.setProperty("background-color", "#999");
		svg.addEventListener("mousemove", (e)=>{svgElementFunctions.handleMouseMove(e, obj, svgElementID)});
		svg.addEventListener("mouseleave", (e)=>{svgElementFunctions.notDragged(e, obj, svgElementID)});
		svg.addEventListener("mouseup", (e)=>{svgElementFunctions.notDragged(e, obj, svgElementID)});

		$(svgContainerID).appendChild(svg);

		var msgInput = document.createElementNS(htmlNS, "input");
		const messageID = "message";
		msgInput.setAttributeNS(null, "id", messageID);
		msgInput.setAttributeNS(null, "type", "text");
		msgInput.setAttributeNS(null, "placeholder", "Add message...");

		$(messageInputID).appendChild(msgInput);

		var btn = document.createElementNS(htmlNS, "button");
		btn.addEventListener("click", (e)=> {
			svgElementFunctions.handleNewSVGElementRequest(e, $(messageID).value, obj);
			$(messageID).value = "";
		});
		var txtnode = document.createTextNode("Add");
		btn.appendChild(txtnode);		

		$(addButtonID).appendChild(btn);
	}
}