import React, {Component} from 'react';

class OptionButtons extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {isInput, isEditing, socket, addInfo, setIsInput, setIsEditing} = this.props;
		return (
			<div className="inlineType atBottom">
			{isInput ? 
				<button
          type="button"
          className="btn btn-secondary"
          onClick={(e)=> {
          	addInfo(socket)}}>Add
        </button>
			:
				<span className="atBottom mb-3 btn-group">
					<button
	          type="button"
	          className="btn btn-secondary"
	          onClick= {(e)=> {setIsInput()}}>
	          Close
	        </button>
					<button
	        	className="btn btn-secondary"
	        	onClick={(e)=> {setIsEditing(true)}}>
	      		{isEditing ? "Finish Edit" : "Edit"} 
	      	</button>
      	</span>
    	}
    	</div>
		)
	}
}
export default OptionButtons;