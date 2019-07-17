import React, {Component} from 'react';
import ImageText from './ImageText';

class ImageTemplate extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {img, isEditable} = this.props;
    const imgPrependID = "imgPrepend";
    return (

      <div>   
        <label className="input-group-prepend">
          <span
            id={imgPrependID}
            className={isEditable ? 
              "btn btn-outline-secondary" :
              "input-group-text bg-white text-secondary border-secondary"
            }
          >Image
            {isEditable ?  
              <input
                className="form-control-file"
                type="file"
                accept="image/*"
                style={{display:"none"}}
                onChange={(e)=> {this.props.setImgInfo(e)}}
              /> : ""
            }
          </span>
          
          <ImageText
            fileName={img && img.fileName ? img.fileName : ""}
            imgPrependID={imgPrependID}
            isEditable={isEditable}
          />
        </label>

        <div
          className="imgContainer">
          {img.src ?
            <img src={img ? img.src : ""} /> : ""
          }
        </div>
      </div>
    )
  }
}
export default ImageTemplate;