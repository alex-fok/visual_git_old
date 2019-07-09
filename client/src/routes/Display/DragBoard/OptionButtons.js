import React, {Component} from 'react';

class OptionButtons extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {isInput, isEditing, socket, addInfo, toEditMode, finishEdit, closeDetails} = this.props;
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
				<span className="btn-group">
					<button
	          type="button"
	          className="btn btn-secondary"
	          onClick= {(e)=> {closeDetails()}}>
	          Close
	        </button>
					<button
	        	className="btn btn-secondary"
	        	onClick={isEditing ? 
	        		((e)=> {toEditMode()}) :
	        		((e)=> {finishEdit()})
	        	}>
	      		{isEditing ? "Finish Edit" : "Edit"} 
	      	</button>
      	</span>
    	}
    	</div>
		)
	}
}
export default OptionButtons;