import React, {Component} from 'react';

const files = {
}

class FileList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			files: files
		}
		this.setFile = this.setFile.bind(this);
	}

	setFile(e) {

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
					<div
						className="list-group-item"
					>
						<label className="input-group-prepend">
		          <span
		            className="btn btn-outline-secondary">
								Add File
								<input
									type="file"
									className="form-control-file"
									onChange={(e)=> {this.setFile(e)}}
									style={{display: "none"}}
								/>
							</span>
						</label>
					</div>
				</div>
			</div>
		)
	}
}
export default FileList;