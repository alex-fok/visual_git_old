import React, {Component} from 'react';
import FileVersionTree from './FileVersionTree';
import FileList from './FileList';

const $ = (id) => {return document.getElementById(id)}

class FileSpace extends Component {
	constructor(props) {
		super(props);
		this.state={
			active: "Files",
			tabs: {},
			files: {
			}
		}
		this.toTab = this.toTab.bind(this);
		this.addTab = this.addTab.bind(this);
		this.closeTab = this.closeTab.bind(this);
		this.setFile = this.setFile.bind(this);
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
				tabs: Object.assign(prev.tabs, {[tabId] : prev.files[tabId]})
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

	setFile(e) {
		if (event.target.files[0]) {
			const fileDirectory = e.target.value;
			var fr = new FileReader();
			fr.readAsDataURL(event.target.files[0]);

			const fileName = fileDirectory.replace(/\\/g, '/').replace(/.*\//, '');
			e.target.value = null;
			fr.onload = () => {
				this.setState(prev => ({
					files: Object.assign(prev.files, {[fileName] : {
						fileName: fileName,
						label: fileName,
						src: fr.result}})
				}))
			}
		}
	}

	removeFile(id) {
		this.setState(prev => ({
			files: delete prev.files[id],
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
								id={tabId}
								className={`nav-item nav-link ${this.state.active === tabId ? "active" : ""}`}
							>
								<span onClick={()=> {this.toTab(tabId)}}>
									{this.state.tabs[tabId].label}
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
						files={this.state.files}
						addTab={this.addTab}
						setFile={this.setFile}
						removeFile={this.removeFile}
					/>
					:
					<FileVersionTree fileData={this.state.files[this.state.active]}/>
				}
				</div>


			</div>
		)
	}
}

export default FileSpace;