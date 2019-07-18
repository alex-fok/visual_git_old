import React, {Component} from 'react';

const $ = (id) => {return document.getElementById(id)}

class FileSpace extends Component {
	constructor(props) {
		super(props);
		this.state={
			active: "home"
		}
		this.toHome = this.toHome.bind(this);
		this.toFile = this.toFile.bind(this);
	}

	toHome() {
		this.setState({
			active: "home"
		})
	}

	toFile() {
		this.setState({
			active: "file"
		})
	}

	render() {
		return (
			<div>
				<ul className="nav nav-tabs mb-3">
				  <li className="nav-item">
				    <a id="home" className={`nav-link ${this.state.active === "home" ? "active" : ""}`} onClick={this.toHome} style={{cursor: "default"}}>Home</a>
				  </li>
				  <li className="nav-item">
				    <a id="file" className={`nav-link ${this.state.active === "file" ? "active" : ""}`} onClick={this.toFile} style={{cursor: "default"}}>File</a>
				  </li>
				</ul>
			</div>
		)
	}
}

export default FileSpace;