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
		const {fileData} = this.props;
		var file = {
			desc: fileData.src.match(/(?:data:)(.*)(?:;)/)[1],
			base64: fileData.src.match(/data:.*;base64/) ? true : false,
			data: fileData.src.match(/(?:data:.*;)(?:base64,)*(.*)/)[1]
		};
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
									file.desc.match(/text\/.*/) ? 
										(file.base64 ? window.atob(file.data) : file.data)
									: file.desc.match(/image\/.*/) ? <img src={this.props.fileData.src}/>
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