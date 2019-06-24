import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class DetailsInfo extends Component {
	constructor(props) {
		super(props);
	};

	render() {
		const {idList} = this.props;
		return (
			<div id={idList.detailsID}>
				<div className="inlineType" id={idList.detailsMsgID}></div>
				<div className="imgContainer" id={idList.detailsImgID}></div>
				<div className="atBottom" id={idList.closeButtonID}></div>
			</div>
		)
	};
}

export default DetailsInfo;