import React, {Component} from 'react';
import FileVersionTree from './FileVersionTree';
import FileList from './FileList';

const $ = (id) => {return document.getElementById(id)}

class FileSpace extends Component {
	constructor(props) {
		super(props);
		this.state={
			active: "Files",
			tabs: {
				Files: {
					label: "Files"
				}
			},
			files: {
				"testfile.txt" : {
					fileName: "testfile.txt",
					label: "testfile.txt"
				}
			}
		}
		this.toTab = this.toTab.bind(this);
		this.addTab = this.addTab.bind(this);
		this.closeTab = this.closeTab.bind(this);
	}

	toTab(tabId) {
		if (this.state.tabs[tabId]) {
			this.setState(prev => ({
				active: tabId
			}))
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
	addTab(id) {
		if (!this.state.tabs[id]) {
			console.log(id + " not found. Adding new tab");
			this.setState(prev => ({
				active: id,
				tabs: Object.assign(prev.tabs, {[id] : prev.files[id]})
			}))
		} else {
			this.setState({
				active: id
			})
		}
	}

	addFile(data) {
		this.setState(prev => ({
			files: Object.assign(prev.files, data)
		}))
	}

	render() {	
		return (
			<div>
				<div className="nav nav-tabs" style={{userSelect: "none"}}>
					{Object.keys(this.state.tabs).map(tabId => {	
						return (
							<div
								key={tabId}
								id={tabId}
								className={`nav-item nav-link ${this.state.active === tabId ? "active" : ""}`}
								onClick={()=> {this.toTab(tabId)}}>
									{this.state.tabs[tabId].label}
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
					<FileList files={this.state.files} addTab={this.addTab}/>
					:
					<FileVersionTree fileData={this.state.tabs[this.state.active]}/>
				}
				</div>


			</div>
		)
	}
}

export default FileSpace;