import React, {Component} from 'react';
import FileTree from './FileTree';
import FileList from './FileList';

const $ = (id) => {return document.getElementById(id)}

class FileSpace extends Component {
	constructor(props) {
		super(props);
		this.state={
			active: "Files",
			tabs: {},
			fileTrees: {
			}
		}
		this.toTab = this.toTab.bind(this);
		this.addTab = this.addTab.bind(this);
		this.closeTab = this.closeTab.bind(this);
		this.addChild = this.addChild.bind(this);
		this.setInitFile = this.setInitFile.bind(this);
		this.addChild = this.addChild.bind(this);
		this.removeFile = this.removeFile.bind(this);
	}

	toTab(tabId) {
		if (tabId === "Files" || this.state.tabs[tabId]) {
			this.setState(prev => ({
				active: tabId
			}))
		}
	}

	addTab(tabId) {
		if (!this.state.tabs[tabId]) {
			console.log(tabId + " not found. Adding new tab");
			this.setState(prev => ({
				active: tabId,
				tabs: Object.assign(prev.tabs, {[tabId] :
					prev.fileTrees[tabId]["0"].fileName})
			}))
		} else {
			this.setState({
				active: tabId
			})
		}
	}

	closeTab(tabId) {
		const temp = this.state.tabs;
		delete temp[tabId];
		this.setState(prev => ({
			active: "Files",
			tabs: temp
		}))
	}

	setInitFile(e) {
		if (event.target.files[0]) {
			const fileDirectory = e.target.value;
			var fr = new FileReader();
			const fileName = fileDirectory.replace(/\\/g, '/').replace(/.*\//, '');
			const ext = fileDirectory.replace(/.*\./,"");
			fr.readAsDataURL(event.target.files[0]);
			e.target.value = null;
			
			fr.onload = () => {
				this.setState(prev => ({
					fileTrees: Object.assign(prev.fileTrees, {
						//fileName.version; first file created always has version "init"
						[fileName] : {
							"0": {
								fileName: fileName,
								version: "0",
								label: fileName,
								extension: ext,
								src: fr.result,
								properties: {
									desc: fr.result.match(/(?:data:)(.*)(?:;)/)[1],
									base64: fr.result.match(/(?:data:.*;base64)/) ? true : false,
									data: fr.result.match(/(?:data:.*;)(?:base64,)*(.*)/)[1]
								},
								position: {
									type: "master",
									parent: "",
									prev:"",
									children: []
								}
							}
						}
					})
				}))
			}
		}
	}

	componentDidMount() {
		console.log(this.state.fileTrees)
	}

	addChild(origin) {
		const childrenArray = origin.position.children;
		const childVersion = `${origin.version}.${childrenArray.length + 1}`;
		childrenArray.push(childVersion);
		const updatedOriginPosition = Object.assign({}, origin, {position: Object.assign({}, origin.position, {children: childrenArray})});
		const childPosition = Object.assign({}, origin, {position: Object.assign({}, origin.position, {
			type: "edit",
			parent: origin.version
		})})
		console.log(`childVersion: ${childVersion}`);
		this.setState(prev=> ({
			fileTrees: Object.assign(prev.fileTrees, 
				{[origin.fileName]: Object.assign({}, prev.fileTrees[origin.fileName],
					//Update children attribute in the origin
					{[origin.version]: Object.assign({}, prev.fileTrees[origin.fileName][origin.version], 
						updatedOriginPosition)
					},
					//Add in the new child node
					{[childVersion]: Object.assign({}, prev.fileTrees[origin.fileName][origin.version],{
						version: childVersion,
						position: {
							type: "edit",
							parent: origin.version,
							prev: "",
							children: []
						}
					})
					}
				)},
			)
		}))
	}

	removeFile(id) {
		this.setState(prev => ({
			fileTrees: delete prev.fileTrees[id],
			tabs: prev.tabs[id] ? delete prev.tabs[id] : prev.tabs
		}))
	}

	render() {
		return (
			<div>
				<div className="nav nav-tabs" style={{userSelect: "none"}}>
					<div
						id="Files"
						className={`nav-item nav-link ${this.state.active=== "Files" ? "active" : ""}`}
						onClick={()=> {this.toTab("Files")}}>
						Files
					</div>
					{Object.keys(this.state.tabs).map(tabId => {	
						return (
							<div
								key={tabId}
								id={`${tabId}_tab`}
								className={`nav-item nav-link ${this.state.active === tabId ? "active" : ""}`}
							>
								<span onClick={()=> {this.toTab(tabId)}}>
									{this.state.tabs[tabId]}
								</span>
									<a 
										className="close"
										onClick={(e)=> {this.closeTab(tabId)}}
									><span>&times;</span></a>
							</div>);
					})}
				</div>
				<div>
				{this.state.active === "Files" ?
					<FileList
						files={this.state.fileTrees}
						addTab={this.addTab}
						setFile={this.setInitFile}
						removeFile={this.removeFile}
					/>
					:
					<FileTree fileTree={this.state.fileTrees[this.state.active]} addChild={this.addChild}/>
				}
				</div>
			</div>
		)
	}
}

export default FileSpace;