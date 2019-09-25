import React, {Component} from 'react';
import './FileTree.css';
import FileTreeNode from './FileTreeNode';
import Arrow from './Arrow';
import {WIDTH, HEIGHT, VIEWBOX, INIT_POSITION, MASTERSIZE, COMMITSIZE, DISPOSITION} from './SvgProps';

const html = "http://www.w3.org/1999/xhtml";

class FileTree extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected:"",
			content: ""
		}
		this.getNode = this.getNode.bind(this);
		this.setSelected = this.setSelected.bind(this);
		this.addCommit = this.addCommit.bind(this);
		this.removeCommit = this.removeCommit.bind(this);
		this.createMaster = this.createMaster.bind(this);
		this.removeMaster = this.removeMaster.bind(this);
		this.getMenuOptions = this.getMenuOptions.bind(this);
		this.configureXY = this.configureXY.bind(this);
		this.configureArrow = this.configureArrow.bind(this);
		this.openNode = this.openNode.bind(this);
		this.modalControl = React.createRef();
	}

	getNode(node) {
		return this.props.fileTree[node];
	}

	setSelected(version) {	
		this.setState({
			selected: version,
			mode: "view"
		})
	}

	addCommit() {
		const {updateTree, fileTree, fileName} = this.props;
    const origin = fileTree[this.state.selected];
    const commitsArray = origin.position.commits;
    const commitVersion = `${origin.version}.${commitsArray.length+1}`;
    commitsArray.push(commitVersion);
		

		var ft = Object.assign({}, fileTree, 
      {[origin.version]: Object.assign({}, fileTree[origin.version], {
        position: Object.assign({}, origin.position, {commits: commitsArray})
      })},
      {[commitVersion]: Object.assign({}, fileTree[origin.version], {
        version: commitVersion,
        position: {
          type: "commit",
          master: origin.version,
          commits: [],
          prev: "",
          next: "",
          active: true
        }
      })}
    );
    updateTree(fileName, ft);
	}
	removeCommit() {
		this.setSelected("");
		var ft = this.props.fileTree;
    const target = ft[this.state.selected];
    const master = ft[target.position.master];

    const index = master.position.commits.indexOf(this.state.selected);
    master.position.commits.splice(index, 1);

    if (master.position.next !== "")
      if (ft[master.position.next].position.fromCommit === this.state.selected)
        ft[master.position.next].position.fromCommit = ""

    ft[target.position.master] = master;
    delete ft[this.state.selected];
    this.props.updateTree(this.props.fileName, ft);
    //callback(ft);
		//this.props.updateTree("removeCommit", this.props.fileName, this.state.selected);
	}
	createMaster() {
		this.props.updateTree("createMaster", this.props.fileName, this.state.selected);
	}
	removeMaster() {
		this.setSelected("");
		this.props.updateTree("removeMaster", this.props.fileName, this.state.selected);
	}
	openNode() {
		this.modalControl.current.click();
	}

	saveChanges() {
		const {selected, content} = this.state;
		const {fileTree, fileName, updateNode} = this.props;
		var node = fileTree[selected];
		var data = node.properties.base64 ? window.btoa(content) : content;
		node = Object.assign({}, node, {
      src: `${node.properties.prefix}${data}`,
      properties: Object.assign({}, node.properties, {
        data: data
      }),
    });
		updateNode(node, fileName);
		this.setState({content: ""})
	}

	getMenuOptions() {
		return {
			open: {
				label: "Open", 
				existsIn: ["init", "master", "commit"], 
				attributes:{},
				func: (()=> this.openNode())
			},
			addCommit: {
				label: "Add Commit", 
				existsIn: ["master", "init"], 
				attributes: {},
				func: (()=> this.addCommit())
			},
			createMaster: {
				label: "Create Master", 
				existsIn: ["commit"],
				attributes: {}, 
				func: (()=> this.createMaster())
			},
			removeCommit: {
				label: "Remove", 
				existsIn: ["commit"], 
				attributes:{},
				func: (()=> this.removeCommit())
			},
			removeMaster: {
				label: "Remove", 
				existsIn: ["master"], 
				attributes:{},
				func: (()=> this.removeMaster())
			}
		}
	}

	componentDidMount() {
		document.getElementById("FileTree").addEventListener("contextmenu", (e)=> {
			e.preventDefault();
		});

		let hideMenu = () => {
			let customMenu = document.getElementById("customMenu")
			customMenu ? customMenu.style.display = "none": ""
		};
		window.addEventListener("click", hideMenu);
		window.addEventListener("scroll", hideMenu)
	}
	getModalContent(file, mode) {
		if (!file) return; 
		const {properties} = file;
		return (properties.desc.match(/text\/.*/) ? 
				(()=>{
					var reactElement;
					const content = properties.base64 ? window.atob(properties.data) : properties.data;
					mode === "edit" ?
						reactElement = React.createElement("textarea", 
							{
								className: "w-100 h-100", 
								value: this.state.content ? this.state.content : content,
								onChange: (e)=> {
									this.setState({
										content: e.target.value
									})
								}
							}
						)
					:
						reactElement = React.createElement("p", {}, content);
					return reactElement; 
				})()
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
		const {mode} = this.state;
		const {fileTree} = this.props;
		const nodeSelected = this.getNode(this.state.selected);
		const menuOptions = this.getMenuOptions();

		return (
			<div>
				<div id="svgContainer" style={{width: `${WIDTH}px`, height: `${HEIGHT}px`}}>
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
										dimension={type==="master" || type==="init" ? MASTERSIZE : COMMITSIZE}
										fill={type==="master" || type==="init" ? "#FF8000" : "#6666FF"}
										openNode={this.openNode}
									/>)
							})
						}
						{
							Object.keys(this.props.fileTree).map(version => {
								let {commits} = fileTree[version].position;
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
									{this.getModalContent(nodeSelected, this.state.mode)}									
								</div>
								<div className="modal-footer">
									{nodeSelected && nodeSelected.position.type==="commit" ? 
										mode==="view" ?
											<button
												type="button"
												className="btn btn-secondary"
												onClick={(e)=>{
													this.setState({
														mode: "edit"
												})}}
											>Edit</button>:
											<button
												type="button"
												className="btn btn-secondary"
												onClick={(e)=> {
													this.saveChanges();
													this.setState({
														mode:"view"
													})
												}}
											>Save Changes</button>
										: ""
									}
									<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Custom menu */}
				<ul
					id="customMenu"
					className="list-group"
					style={{
						display: "none",
						position: "fixed"
					}}
				>
					{
						Object.keys(menuOptions).map((opt)=> {
							return <li
								key={opt}
								style={nodeSelected && menuOptions[opt].existsIn.includes(nodeSelected.position.type) ? {display: "block"} : {display: "none"}}
								className={`list-group-item list-group-item-light list-group-item-action menu-option`}
								onClick={()=> {menuOptions[opt].func()}}
								>{menuOptions[opt].label}
							</li>
						})
					}
				</ul>

				{/* Modal on-off control */}
				<button
					type="button"
					ref={this.modalControl}
					data-toggle="modal"
					data-target="#details"
					style={{display: "none"}}>
				</button>
			</div>
		)	
	}
}

export default FileTree;