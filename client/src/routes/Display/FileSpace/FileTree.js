import React, {Component} from 'react';
import './FileTree.css';
import FileTreeNode from './FileTreeNode';
import Arrow from './Arrow';
import {WIDTH, HEIGHT, VIEWBOX, INIT_POSITION, MASTERSIZE, COMMITSIZE, DISPOSITION} from './SvgProps';

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
		this.getNode = this.getNode.bind(this);
		this.setSelected = this.setSelected.bind(this);
		this.addCommit = this.addCommit.bind(this);
		this.createMaster = this.createMaster.bind(this);
		this.getMenuOptions = this.getMenuOptions.bind(this);
		this.configureXY = this.configureXY.bind(this);
		this.configureArrow = this.configureArrow.bind(this);
		
	}

	getNode(node) {
		return this.props.fileTree[node];
	}

	setSelected(version) {	
		this.setState({
			selected: version
		})
	}

	addCommit(e) {
		this.props.addCommit(this.props.fileName, this.state.selected);
	}
	removeCommit(e) {
		this.props.removeCommit(this.props.fileName, this.state.selected);
	}
	createMaster(e) {
		const selected = this.getNode(this.state.selected);
		this.props.createMaster(this.state.selected, selected.position.master, {properties: selected.properties});
	}
	editNode(e) {
		console.log("edit Node");
	}

	getMenuOptions() {
		return {
			addCommit: {label: "Add Commit", existsIn: ["master"], func: ((node)=> this.addCommit(node))},
			createMaster: {label: "Create Master", existsIn: ["commit"], func: ((node)=> this.createMaster(node))},
			edit: {label: "Edit", existsIn: ["commit"], func: ((node)=> this.editNode(node))},
			removeCommit: {label: "Delete", existsIn: ["commit"], func: ((node)=> this.removeCommit(node))},

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
		const node = this.getNode(version);
		const {position} = node;
		var c = {x: 0, y: 0};

		const dependency = 
			position.type==="master" ? position.prev : 
			position.type==="commit" ? position.master : "";

		if (!dependency && !position.prev && !position.master) {
			Object.assign(c, INIT_POSITION)
		}
		else {
			const last = this.configureXY(dependency); 

			Object.assign(c, position.type === "master" ?
				{	x: last.x + DISPOSITION.Ms_x, y: last.y} :
				{ x: last.x + DISPOSITION.M2C_x, y: last.y + DISPOSITION.M2C_y + 
					this.getNode(dependency).position
					.commits.indexOf(node.version) * DISPOSITION.Ss_y}
			)
		}
		return c;
	}

	configureArrow(current, target, relation) {
		const src = this.configureXY(current);
		const dest = this.configureXY(target);
		return (
			<Arrow
				key={`${current}To${target}`}
				type={relation}
				src={src}
				dest={dest}
				sSize = {MASTERSIZE}
			  dSize = {relation === "M2M" ? MASTERSIZE : COMMITSIZE}
			/>
		)
	}

	render() {
		const {fileTree} = this.props;
		console.log(JSON.stringify(fileTree));
		const nodeSelected = this.getNode(this.state.selected);
		return (
			<div>
				<div style={{width: `${WIDTH}px`, height: `${HEIGHT}px`}}>
					<svg
						id="FileTree"
						viewBox={`0 0 ${VIEWBOX.x} ${VIEWBOX.y}`}
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
										dimension={type==="master" ? MASTERSIZE : COMMITSIZE}
										fill={type==="master" ? "#FF8000" : "#6666FF"}
									/>)
							})
						}
						{
							Object.keys(this.props.fileTree).map(version => {
								let {commits} = fileTree[version].position;
								console.log("commits: "+commits);
								return commits.length ? commits.map(commit => {
									return this.configureArrow(version, commit, "M2C")
								}) : ""
							})
						}
						{
							Object.keys(this.props.fileTree).map(version => {
								let {next} = fileTree[version].position;
								return next ? this.configureArrow(version, next, "M2M") : ""
							})
						}
					</svg>

					<div className="modal fade" id="details" role="document">
						<div className="modal-dialog modal-lg">
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
							>{optionProps.label}</li>
					})}
				</ul>
			</div>
		)	
	}
}

export default FileTree;