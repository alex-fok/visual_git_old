import React, {Component} from 'react';

class FileVersionTree extends Component {
	constructor(props) {
		super(props);
		this.state = {
			popOver: {
				file: {
					id: "",
					data: {}
				}
			}
		}
	}

	componentDidMount() {
		document.getElementById("FileVersionTree").addEventListener("contextmenu", (e)=> {
			e.preventDefault();
		});
		document.getElementById("block").addEventListener("contextmenu", (e)=> {
			

		})
	}

	render() {
		const {file} = this.props;
		return (
			<div>
				<div style={{width: "1200px", height: "600px"}}>
					<svg
						id="FileVersionTree"
						viewBox={`0 0 300 150`}
						width="100%"
						height="100%"
						style={{backgroundColor: "#F5F5F5"}}
						onClick={(e)=> {
							document.getElementById("customMenu") ?
							document.getElementById("customMenu").style.display = "none"
							: ""}}
					>
						<rect 
							x="25"
							y="70"
							width="10"
							height="10"
							id="block"
							fill="#FF8000"
							data-toggle="modal"
							data-target="#details"
							onContextMenu={(e)=> {
								
								document.getElementById("customMenu").style.display = "block";
								document.getElementById("customMenu").style.left = `${e.pageX - window.scrollX + 15}px`;
								document.getElementById("customMenu").style.top = `${e.pageY - window.scrollY + 15}px`;
								console.log(`${e.pageX - window.scrollX + 15}px`);
								console.log(document.getElementById("customMenu").style.left);
							}}
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
										<img src={file.src} />
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
				
				<ul
					id="customMenu"
					className="list-group"
					style={{
						display: "none",
						position: "fixed"
					}}
				>
					<li className="list-group-item">Add Child</li>
					<li className="list-group-item">Edit</li>
					<li className="list-group-item">Remove</li>
				</ul>
				
			</div>
		)	
	}
}

export default FileVersionTree;