import React, {Component} from 'react';
import './FileTree.css';
import FileTreeNode from './FileTreeNode';
import Arrow from './Arrow';
import SvgProps from './SvgProps.json';

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
		this.addChild = this.addChild.bind(this);
		this.addNext = this.addNext.bind(this);
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

	addChild(e) {
		this.props.addChild(this.getNode(this.state.selected));
	}
	addNext(e) {
		const selected = this.getNode(this.state.selected);
		this.props.addNext(this.getNode(selected.position.parent), {properties: selected.properties});
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
			addNext: {existsIn: ["subVer"], func: ((node)=> this.addNext(node))},
			edit: {existsIn: ["master", "subVer"], func: ((node)=> this.editNode(node))},
			delete: {existsIn: ["master", "subVer"], func: ((node)=> this.deleteNode(node))}
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
			position.type==="subVer" ? position.parent : "";

		if (!dependency && !position.prev && !position.parent) {
			Object.assign(c, SvgProps.INIT_POSITION)
		}
		else {
			const last = this.configureXY(dependency); 

			Object.assign(c, position.type === "master" ?
				{	x: last.x + SvgProps.Ms_x, y: last.y} :
				{ x: last.x + SvgProps.M2S_x, y: last.y + SvgProps.M2S_y + 
					this.getNode(dependency).position
					.children.indexOf(node.version) * SvgProps.Ss_y}
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
				sSize = {SvgProps.MASTERSIZE}
			  dSize = {relation === "M2M" ? SvgProps.MASTERSIZE : SvgProps.SUBVERSIZE}
			/>
		)
	}

	render() {
		const {fileTree} = this.props;
		const nodeSelected = this.getNode(this.state.selected);

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
										dimension={type==="master" ?SvgProps.MASTERSIZE : SvgProps.SUBVERSIZE}
										fill={type==="master" ? "#FF8000" : "#6666FF"}
									/>)
							})
						}
						
						{
							Object.keys(this.props.fileTree).map(version => {
								let {children} = fileTree[version].position;
								return children.length ? children.map(child => {
									return this.configureArrow(version, child, "M2S")
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
							>{option}</li>
					})}
				</ul>
			</div>
		)	
	}
}

export default FileTree;