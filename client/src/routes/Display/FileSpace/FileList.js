import React, {Component} from 'react';

const files = {
}

class FileList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			files: files
		}
	}
	render() {
		return (
			<div>
				<div className="list-group">
					{Object.keys(this.props.files).map(id => {
						return (
							<div
								key={id}
								id={id}
								className="list-group-item list-group-item-action"
								style={{userSelect: "none"}}
								aria-label={id}
								onClick={(e)=>{this.props.addTab(e.target.getAttribute("id"))}}
							>{this.props.files[id].fileName}
							</div>)
						})
					}
				</div>
			</div>
		)
	}
}
export default FileList;