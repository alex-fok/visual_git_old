import React, {Component} from 'react';

class FileVersionTree extends Component {
	constructor(props) {
		super(props);
		this.showDetails = this.showDetails.bind(this);
		this.state = {
			popOver: {
				file: {
					id: "",
					data: {}
				}
			}
		}
		this.setSize = this.setSize.bind(this);
	}

	showDetails() {
		
	}

	setSize(img) {
		document.getElementById(this.props.file.fileName).style.width = `${img.width}px`;
		document.getElementById(this.props.file.fileName).style.height = `${img.height}px`;
	}
	render() {
		const {file} = this.props;
		return (

			<div style={{width: "1200px", height: "600px"}}>
				<svg
					viewBox={`0 0 300 150`}
					width="100%"
					height="100%"
					style={{backgroundColor: "#F5F5F5"}}
				>
					<rect 
						x="25"
						y="70"
						width="10"
						height="10"
						fill="#FF8000"
						data-toggle="modal"
						data-target="#details"
						onClick={this.showDetails}
					/>
				</svg>
				<div className="modal" id="details" role="dialog">
					<div className="modal-dialog">
						<div id={file.fileName} className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">{file.fileName}</h5>
							</div>
							<div 
								className="modal-body">
								{
									file.properties.desc.match(/text\/.*/) ? 
										<textarea 
											style={{width: "100%"}}
											value= {file.properties.base64 ? 
												window.atob(file.properties.data)
											: file.properties.data} readOnly
										></textarea>
									: file.properties.desc.match(/image\/.*/) ? 
									<img src={file.src} onLoad={(e)=>{this.setSize(e.target)}}/>
									: "NOT TEXT OR IMAGE"
								}
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)	
	}
}

export default FileVersionTree;