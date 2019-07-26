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
		this.setInitFile = this.setInitFile.bind(this);
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
					prev.fileTrees[tabId].init.fileName})
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
						[fileName] : {
							init: {
								fileName: fileName,
								version: 1,
								label: fileName,
								extension: ext,
								src: fr.result,
								properties: {
									desc: fr.result.match(/(?:data:)(.*)(?:;)/)[1],
									base64: fr.result.match(/(?:data:.*;base64)/) ? true : false,
									data: fr.result.match(/(?:data:.*;)(?:base64,)*(.*)/)[1]
								}
							}
						}
					})
				}))
			}
		}
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
									<button 
										type="button"
										className="close"
										onClick={(e)=> {this.closeTab(tabId)}}
									><span>&times;</span></button>
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
					<FileTree fileTree={this.state.fileTrees[this.state.active]}/>
				}
				</div>
			</div>
		)
	}
}

export default FileSpace;