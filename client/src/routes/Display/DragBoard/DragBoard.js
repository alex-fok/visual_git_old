import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import initDragBoard from './initDragBoard';
import SVGPanel from './SVGPanel';
import InfoPanel from './InfoPanel';    
import './DragBoard.css';
import idList from './idList.json';
const svgNS = "http://www.w3.org/2000/svg";

const {svgElementID, svgObjTagID} = idList;

const size = 1200,
      div_w = size,
      div_h = size*.5,
      svg_w = div_w*.4,
      svg_h = div_h,
      details_w = div_w*.4,
      details_h = div_h;

class DragBoard extends Component {
  constructor(props) {
      super(props);
      this.state={
        socket: io(this.props.host, {transports: ['websocket']}),
        isInput: true,
        selectedItem: {
          id: "",
          msg: "",
          img: ""
        }
      }
      this.setIsInput = this.setIsInput.bind(this);
      this.setSelectedItem = this.setSelectedItem.bind(this);
    }

  componentWillUnmount() {
    this.state.socket.close();
  }

  setIsInput(bool) {
    this.setState({
      isInput: bool
    })
  }

  setSelectedItem(id, msg, img){
    this.setState({
      selectedItem: {
        id: id,
        msg: msg,
        img: img
      },
      isInput: false
    })
  }

  render() {
    const {svgElements, selectedItem, socket, isInput, setIsInput} = this.state;
    return(
      <div>
        <div className="container-fluid noPadding">
          <div style={{width:div_w, height:div_h}}>
            <div className="row">
              <div className="col">
                <SVGPanel
                  socket={socket}
                  jwt={this.props.jwt}
                  dimension={{width: svg_w, height: svg_h}}
                  svgElementID={svgElementID}
                  svgObjTagID={svgObjTagID}
                  selectedItem={this.state.selectedItem}
                  setSelectedItem={this.setSelectedItem}
                />
              </div>
              <div className="col">
                <InfoPanel
                  dimension={{width: details_w, height: details_h}}
                  socket={this.state.socket}
                  setIsInput={this.setIsInput}
                  isInput={isInput}
                  svgId={!isInput ? selectedItem.id : ""}
                  msgReceived={!isInput ? selectedItem.msg : ""}
                  imgReceived={!isInput ? selectedItem.img : ""}/>
              </div>
            </div>
          </div>
        </div>
        <div id="svgObjTag"></div>
      </div>
    );
  }
}

export default DragBoard;