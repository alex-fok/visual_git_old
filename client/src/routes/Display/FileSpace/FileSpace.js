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
					id: "Files"
				},
				file: {
					id: "file",
					fileBit:""
				}
			}
		}
		this.toTab = this.toTab.bind(this);
		this.addTab = this.addTab.bind(this);
	}

	toTab(tabId) {
		this.setState({
			active: tabId
		})
	}

	addTab(data) {
		this.setState(prev => ({
			tabs: Object.assign(prev.tabs, {[data.id] : data})
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
								onClick={()=> {this.toTab(tabId)}}>{tabId}</div>);
					})}
				</div>
				<div>
				{this.state.active === "Files" ?
					<FileList files={this.props.fileList} addTab={this.addTab}/>
					:
					<FileVersionTree fileData={this.state.tabs[this.state.active]}/>
				}
				</div>


			</div>
		)
	}
}

export default FileSpace;