import React, {Component} from 'react';
import './FileTree.css';

const htmlNS = "http://www.w3.org/1999/xhtml";
const svgNS = "http://www.w3.org/2000/svg";

class FileTree extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected:""
		}
		this.setModal = this.setModal.bind(this);
	}

	componentDidMount() {
		document.getElementById("FileTree").addEventListener("contextmenu", (e)=> {
			e.preventDefault();
		});

		document.getElementById("FileTree").addEventListener("click", (e) => {
			document.getElementById("customMenu") ?
			document.getElementById("customMenu").style.display = "none"
			: ""});

		const blocks = document.getElementsByClassName("block");
		for (let i = 0; blocks.length; i++){
			blocks[i].addEventListener("contextmenu", (e)=> {
				document.getElementById("customMenu").style.display = "block";
				document.getElementById("customMenu").style.left = `${e.pageX - window.scrollX + 10}px`;
				document.getElementById("customMenu").style.top = `${e.pageY - window.scrollY + 10}px`;
			});
		}

		const menuOptions = document.getElementsByClassName("menu-option");

		for (let i = 0; i < menuOptions.length; i++) {
			
			menuOptions[i].addEventListener("mouseleave", (e)=> {
				e.currentTarget.classList.remove("active")
			});

			menuOptions[i].addEventListener("click", (e)=> {
				document.getElementById("customMenu").style.display = "none";
			})
		}

		Object.keys(this.props.fileTree).forEach(version => {
			document.getElementById("FileTree").appendChild(this.createRect(20, 75, version))
		})
	}

	setModal(version) {	
		this.setState({
			selected: version
		})
	}

	getModalContent(selected) {
		console.log(this.state.selected);
		const file = this.props.fileTree[this.state.selected];
		if (!file) return; 
		const properties = file.properties;
		return (properties.desc.match(/text\/.*/) ? 
				<p>
					{properties.base64 ? 
						window.atob(properties.data)
					: properties.data}
				></p>
			: properties.desc.match(/image\/.*/) ? 
			<img src={file.src} />
			: "NOT TEXT OR IMAGE"
		)
	}

	createRect(x, y, version) {
		console.log(`x:${x} y:${y} version:${version}`);
		const rect = document.createElementNS(svgNS, "rect");
		rect.setAttributeNS(null, "x", parseInt(x));
		rect.setAttributeNS(null, "y", parseInt(y));
		rect.setAttributeNS(null, "width", 10);
		rect.setAttributeNS(null, "height", 10);
		rect.setAttributeNS(null, "class", "block");
		rect.setAttributeNS(null, "fill", "#FF8000");
		rect.setAttributeNS(null, "aria-label", version)
		rect.setAttributeNS(null, "data-toggle", "modal");
		rect.setAttributeNS(null, "data-target", "#details");
		rect.addEventListener("click", ((e)=> {
			console.log(version);this.setModal(version)}));
		return rect;
	}

	render() {
		const {fileTree} = this.props;

		return (
			<div>
				<div style={{width: "1200px", height: "600px"}}>
					<svg
						id="FileTree"
						viewBox={`0 0 300 150`}
						width="100%"
						height="100%"
						style={{backgroundColor: "#F5F5F5"}}
					>
					</svg>

					<div className="modal fade" id="details" role="document">
						<div className="modal-dialog modal-lg" style={{width: "1124px"}}>
							<div className="modal-content w-100">
								<div className="modal-header">
									<h5 className="modal-title">{this.props.fileTree[this.state.selected] ? 
										this.props.fileTree[this.state.selected].fileName: "Untitled"}  </h5>
								</div>
								<div className="modal-body" style={{overflow: "auto", height: "400px"}}>
									{this.getModalContent(this.state.selected)}
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				{//
				// <ul
				// 	id="customMenu"
				// 	className="list-group"
				// 	style={{
				// 		display: "none",
				// 		position: "fixed"
				// 	}}
				// >
				// 	<li className="list-group-item list-group-item-light list-group-item-action menu-option" onClick={(e)=> {console.log(e.currentTarget)}}>Add Child</li>
				// 	<li className="list-group-item list-group-item-light list-group-item-action menu-option">Edit</li>
				// 	<li className="list-group-item list-group-item-light list-group-item-action menu-option">Remove</li>
				// </ul>
				}
			</div>
		)	
	}
}

export default FileTree;