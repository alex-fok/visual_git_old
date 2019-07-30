import React, {Component} from 'react';
import './FileTree.css';
import FileTreeNode from './FileTreeNode';

class FileTree extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected:"",
			nodeMap: {},
			latest: {
				x: 0, 
				y: 0
			}
		}
		this.setSelected = this.setSelected.bind(this);
		this.addChild = this.addChild.bind(this);
		this.configureXY = this.configureXY.bind(this);
	}

	addChild(e) {
		console.log(this.props.fileTree[this.state.selected]);
	}

	componentDidMount() {
		document.getElementById("FileTree").addEventListener("contextmenu", (e)=> {
			e.preventDefault();
		});

		document.getElementById("FileTree").addEventListener("click", (e) => {
			document.getElementById("customMenu") ?
			document.getElementById("customMenu").style.display = "none"
			: ""});

		const menuOptions = document.getElementsByClassName("menu-option");

		for (let i = 0; i < menuOptions.length; i++) {
			menuOptions[i].addEventListener("click", (e)=> {
				document.getElementById("customMenu").style.display = "none";
			})
		}

		console.log(this.state.nodeMap)
	}

	setSelected(version) {	
		this.setState({
			selected: version
		})
	}

	getModalContent(selected) {
		const file = this.props.fileTree[this.state.selected];
		if (!file) return; 
		const properties = file.properties;
		return (properties.desc.match(/text\/.*/) ? 
				<p>
					{properties.base64 ? 
						window.atob(properties.data)
					: properties.data}
				</p>
			: properties.desc.match(/image\/.*/) ? 
			<img src={file.src} />
			: "NOT TEXT OR IMAGE"
		)
	}

	configureXY(node) {
		const type = this.props.fileTree[node]
		var c = {x: 0, y: 0};

		const dependency = 
			node.type==="master" ? node.prev : 
				node.type==="edit" ? node.parent : "";

		if (!dependency && !node.prev && !node.parent) {
			Object.assign(c, {x: 30, y: 30})
		}
		else {
			Object.assign(c, {x: prevXY.x + 5, y: prevXY.y})
		}
		return c;
	}

	render() {
		const {fileTree} = this.props;
		const nodeSelected = this.props.fileTree[this.state.selected];

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
						{
							Object.keys(this.props.fileTree).map(version => {
								return <FileTreeNode key={version} version={version} setSelected={this.setSelected}  coordinate={this.configureXY(version)}/>
							})
						}
					</svg>

					<div className="modal fade" id="details" role="document">
						<div className="modal-dialog modal-lg" style={{width: "1124px"}}>
							<div className="modal-content w-100">
								<div className="modal-header">
									<h5 className="modal-title">{nodeSelected ? 
										nodeSelected.fileName: "Untitled"}  </h5>
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
				
				<ul
					id="customMenu"
					className="list-group"
					style={{
						display: "none",
						position: "fixed"
					}}
				>
					<li className="list-group-item list-group-item-light list-group-item-action menu-option" onClick={(e)=> {this.addChild(e)}}>Add Child</li>
					<li className="list-group-item list-group-item-light list-group-item-action menu-option">Edit</li>
					<li className="list-group-item list-group-item-light list-group-item-action menu-option">Remove</li>
				</ul>
			</div>
		)	
	}
}

export default FileTree;