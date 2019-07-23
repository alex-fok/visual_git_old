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
	}

	showDetails() {
		
	}
	render() {
		var fileType = this.props.fileData.src.match(/(?:data:)(.*)(?:;)/)[1];
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
				<div className="modal fade" id="details" role="dialog" aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-body">
								{
									fileType.match(/text\/.*/) ? "TEXT"
									: fileType.match(/image\/.*/) ? <img src={this.props.fileData.src}/>
									: "NOT TEXT OR IMAGE"
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		)	
	}
}

export default FileVersionTree;