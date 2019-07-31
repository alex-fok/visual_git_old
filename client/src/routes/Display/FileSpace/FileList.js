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

	componentDidMount() {
		// Set up association between the file button and the actual file input
		document.getElementById("file-button")
			.addEventListener("click", ()=> {document.getElementById("file-input").click()});
	}

	render() {
		return (
			<div>
				<div className="list-group">
					{Object.keys(this.props.files).map(id => {
						return (
							<div
								key={id}
								id={`${id}_list_item`}
								className="list-group-item list-group-item-action"
								style={{userSelect: "none"}}
								aria-label={id}
								onClick={(e)=>{e.target.getAttribute("aria-label")===id ? this.props.addTab(e.target.getAttribute("aria-label")) : e.stopPropagation()}}
							>
								<span
									className="px-1"
									aria-label={id}
									//onClick={(e)=>{this.props.addTab(e.target.getAttribute("id"))}}
								>{this.props.files[id]["0"].fileName}
								</span>
								<button
									type="button"
									className="close float-left"
									onClick={()=> {this.props.removeFile(id)}}
								>
									<span className="px-1">&times;</span></button>
							</div>)
						})
					}
					<div className="list-group-item">
						<input
							id="file-input"
							type="file"
							onChange={(e)=> {this.props.setFile(e)}}
							style={{display: "none"}}
						/>
						<button
							id="file-button"
							type="button"
							className="btn btn-outline-secondary"
						>Add File...
						</button>
					</div>
				</div>
			</div>
		)
	}
}
export default FileList;