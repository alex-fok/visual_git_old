import React, {Component} from 'react';
import './FileTree.css';
import FileTreeNode from './FileTreeNode';

class FileTree extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected:"",
			latest: {
				x: 0, 
				y: 0
			}
		}
		this.getSelected = this.getSelected.bind(this);
		this.setSelected = this.setSelected.bind(this);
		this.addChild = this.addChild.bind(this);
		this.getMenuOptions = this.getMenuOptions.bind(this);
		this.configureXY = this.configureXY.bind(this);
	}

	getSelected() {
		return this.props.fileTree[this.state.selected];
	}

	setSelected(version) {	
		this.setState({
			selected: version
		})
	}

	addChild(e) {
		this.props.addChild(this.getSelected());
	}
	editNode(e) {
		console.log("edit Node");
	}
	deleteNode(e) {
		console.log("delete Node");
	}

	getMenuOptions() {
		return {
			addChild: {existsIn: ["master"], func: ((node)=> this.addChild(node))},
			edit: {existsIn: ["master", "edit"], func: ((node)=> this.editNode(node))},
			delete: {existsIn: ["master", "edit"], func: ((node)=> this.deleteNode(node))}
		}
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

	configureXY(version) {
		const node = this.props.fileTree[version];
		const {position} = node;
		var c = {x: 0, y: 0};

		const dependency = 
			position.type==="master" ? position.prev : 
				position.type==="edit" ? position.parent : "";

		if (!dependency && !position.prev && !position.parent) {
			Object.assign(c, {x: 30, y: 30})
		}
		else {
			console.log(`node version: ${node.version } ${this.props.fileTree[dependency].position.children.indexOf(node.version)}`)
			const last = this.configureXY(dependency); 
			const disposition = this.props.fileTree[dependency].position.children.indexOf(node.version) + 1;
			Object.assign(c, {
				x: disposition > 0 ? last.x + 15 : last.x + 50, 
				y: position.type==="master" ? last.y : 
				last.y + 20 * disposition
			})
		}
		return c;
	}

	render() {
		const {fileTree} = this.props;
		const nodeSelected = this.getSelected();

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
								let type = fileTree[version].position.type;
								return (
									<FileTreeNode 
										key={version}
										version={version}
										setSelected={this.setSelected}
									  coordinate={this.configureXY(version)}
										dimension={type==="master" ? "10" : "5"}
										fill={type==="master" ? "#FF8000" : "#DAE8FC"}
									/>)
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
					{Object.keys(this.getMenuOptions()).map((option)=> {
						const optionProps = this.getMenuOptions()[option];
						return <li
							key={option}
							style={nodeSelected && optionProps.existsIn.includes(nodeSelected.position.type) ? {display: "block"} : {display: "none"}}
							className="list-group-item list-group-item-light list-group-item-action menu-option"
							onClick={()=> {optionProps.func(nodeSelected)}}
							>{option}</li>
					})}
				</ul>
			</div>
		)	
	}
}

export default FileTree;