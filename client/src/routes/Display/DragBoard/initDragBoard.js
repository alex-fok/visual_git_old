import svgElementFunctions from './svgElementFunctions';

const   svgNS = "http://www.w3.org/2000/svg",
    htmlNS = "http://www.w3.org/1999/xhtml";
const $ = (id) => {return document.getElementById(id)};

export default {
  initSocket: (obj, idList) => {
    //console.log("initSocket: idList.infoIDs : " + JSON.stringify(idList.infoIDs));
    const {socket} = obj.state;

    socket.on("svgAdd", (data) => {
      let {svgElements} = obj.state;
      let svgObj = data[Object.keys(data)[0]];

      obj.setState(prev => ({
        svgElements: Object.assign(svgElements, data)
      }));
      svgElementFunctions.appendSVG(svgElementFunctions.createRectSVGElement(svgObj, idList.svgObjTagID, {
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
        // Object.keys(data).forEach(key => {
        //   svgElementFunctions.appendSVG(svgElementFunctions.createRectSVGElement(data[key], idList.infoIDs,
        //   {
        //     handleMouseDown: svgElementFunctions.handleMouseDown,
        //     showTag: svgElementFunctions.showTag,
        //     hideTag: svgElementFunctions.hideTag,
        //     showDetails: svgElementFunctions.showDetails
        //   }, obj), idList.svgElementID);
        // });
      }
    });

    socket.emit("svgCopyRequest", obj.props.jwt);
  },

  svgAddListener: (svgElementID, obj) => {
    $(svgElementID).addEventListener("mousemove", (e)=>{svgElementFunctions.handleMouseMove(e, obj, svgElementID)});
    $(svgElementID).addEventListener("mouseleave", (e)=>{svgElementFunctions.notDragged(e, obj, svgElementID)});
    $(svgElementID).addEventListener("mouseup", (e)=>{svgElementFunctions.notDragged(e, obj, svgElementID)});
  }
}