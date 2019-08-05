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
		this.addSub = this.addSub.bind(this);
		this.setInitFile = this.setInitFile.bind(this);
		this.createMaster = this.createMaster.bind(this);
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
									master: "",
									subs: [],
									prev: "",
									next: "",
									fromSub: ""
								}
							}
						}
					})
				}))
			}
		}
	}

	createMaster(sub, origin, data) {
		const nextVersion = (parseInt(origin.version) + 1).toString();
		this.setState(prev => ({
			fileTrees: Object.assign(prev.fileTrees,
				{[origin.fileName]: Object.assign({}, prev.fileTrees[origin.fileName],
					{[origin.version]: Object.assign({}, prev.fileTrees[origin.fileName][origin.version], {
						position: Object.assign({}, prev.fileTrees[origin.fileName][origin.version].position, {
							next: nextVersion
						})
					})},
					{[nextVersion]: Object.assign({}, prev.fileTrees[origin.fileName][origin.version], {
						version: nextVersion,
						position: {
							type: "master",
							master: "",
							subs: [],
							prev: origin.version,
							next: "",
							fromSub: sub.version
						}
					}, data)}
				)}
			)
		}))
	}

	addSub(origin) {
		const subsArray = origin.position.subs;
		const sub = `${origin.version}.${subsArray.length + 1}`;
		subsArray.push(sub);
		const subPosition = Object.assign({}, origin.position, {
			type: "subVer",
			master: origin.version
		});
		const updatedOriginPosition = Object.assign({}, origin.position, {subs: subsArray});
		
		this.setState(prev=> ({
			fileTrees: Object.assign(prev.fileTrees, 
				{[origin.fileName]: Object.assign({}, prev.fileTrees[origin.fileName],
					//Update subs attribute in the origin
					{[origin.version]: Object.assign({}, prev.fileTrees[origin.fileName][origin.version],{ 
						position: updatedOriginPosition})
					},
					//Add in the new sub node
					{[sub]: Object.assign({}, prev.fileTrees[origin.fileName][origin.version],{
						version: sub,
						position: {
							type: "sub",
							master: origin.version,
							subs: [],
							prev: "",
							next: ""}
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
					<FileTree
						fileTree={this.state.fileTrees[this.state.active]}
						addSub={this.addSub}
						createMaster={this.createMaster}
						/>
				}
				</div>
			</div>
		)
	}
}

export default FileSpace;