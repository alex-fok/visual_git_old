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

	setSize(w,h) {
		console.log(`width: ${w}, height: ${h}`)
	document.getElementsByClassName("modal-lg").style.width = `${w}px`;
	document.getElementsByClassName("modal-lg").style.height = `${h}px`;
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
				<div className="modal fade" id="details" role="document">
					<div className="modal-dialog modal-lg" style={{width: "1124px"}}>
						<div id={file.fileName} className="modal-content w-100">
							<div className="modal-header">
								<h5 className="modal-title">{file.fileName}</h5>
							</div>
							<div className="modal-body" style={{overflow: "auto", height: "400px"}}>
								{
									file.properties.desc.match(/text\/.*/) ? 
										<p>
											{file.properties.base64 ? 
												window.atob(file.properties.data)
											: file.properties.data}
										></p>
									: file.properties.desc.match(/image\/.*/) ? 
									<img src={file.src} onLoad={(e)=>{this.setSize(e.target.width, e.target.height)}}/>
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