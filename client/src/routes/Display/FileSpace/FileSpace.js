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
    this.addCommit = this.addCommit.bind(this);
    this.setInitFile = this.setInitFile.bind(this);
    this.createMaster = this.createMaster.bind(this);
    this.removeMaster = this.removeMaster.bind(this);
    this.removeCommit = this.removeCommit.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.updateTree = this.updateTree.bind(this);
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
    if (e.target.files[0]) {
      const fileDirectory = e.target.value;
      var fr = new FileReader();
      const fileName = fileDirectory.replace(/\\/g, '/').replace(/.*\//, '');
      const ext = fileDirectory.replace(/.*\./,"");
      fr.readAsDataURL(e.target.files[0]);
      e.target.value = null;
      
      fr.onload = () => {
        console.log(fr.result);
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
                  prefix: fr.result.match(/(data:.*;)(base64,)*/)[1],
                  desc: fr.result.match(/(?:data:)(.*)(?:;)/)[1],
                  base64: fr.result.match(/(?:data:.*;base64)/) ? true : false,
                  data: fr.result.match(/(?:data:.*;)(?:base64,)*(.*)/)[1]
                },
                position: {
                  active: true,
                  type: "init",
                  master: "",
                  commits: [],
                  prev: "",
                  next: "",
                  fromCommit: ""
                }
              }
            }
          })
        }))
      }
    }
  }

  createMaster(fileTree, commitVersion, callback) {
    const ft = fileTree;    
    const originVersion = fileTree[commitVersion].position.master;
    const nextVersion = (parseInt(originVersion) + 1).toString();

    Object.assign(ft,
      {[originVersion]: Object.assign({}, ft[originVersion], {
          position: Object.assign({}, ft[originVersion].position, {
            next: nextVersion,
            active: false
          })
      })},
      {[nextVersion]: Object.assign({}, ft[originVersion], {
          version: nextVersion,
          properties: ft[commitVersion].properties,
          position: {
            type: "master",
            master: "",
            commits: [],
            prev: originVersion,
            next: "",
            fromCommit: commitVersion,
            active: true
          }
      })}
    );
    callback(ft);
  }

  addCommit(fileTree, originVersion, callback) {
    const ft = fileTree;
    const origin = ft[originVersion];
    const commitsArray = origin.position.commits;
    const commitVersion = `${origin.version}.${commitsArray.length+1}`;
    commitsArray.push(commitVersion);

    Object.assign(ft, 
      {[origin.version]: Object.assign({}, ft[origin.version], {
        position: Object.assign({}, origin.position, {commits: commitsArray})
      })},
      {[commitVersion]: Object.assign({}, ft[origin.version], {
        version: commitVersion,
        position: {
          type: "commit",
          master: origin.version,
          commits: [],
          prev: "",
          next: "",
          active: true
        }
      })
      }
    );
    callback(ft);
  }

  removeMaster(fileTree, targetVersion, callback) {
    var ft = fileTree;
    const target = ft[targetVersion];
    
    if(target.position.next!=="")
      this.removeMaster(ft, target.position.next, updatedFT=>{ft=updatedFT});

    const {commits, prev} = target.position;
    if (commits.length > 0)
      for (var i = 0; i < commits.length; i++)
        delete ft[commits[i]];

    if (prev !== "")
      ft[prev].position.next = "";

    delete ft[targetVersion];
    callback(ft);
  }

  removeCommit(fileTree, targetVersion, callback) {
    var ft = fileTree;
    const target = ft[targetVersion];
    const master = ft[target.position.master];
            
    const index = master.position.commits.indexOf(targetVersion);
    master.position.commits.splice(index, 1);

    if (master.position.next !== "")
      if (ft[master.position.next].position.fromCommit === targetVersion)
        ft[master.position.next].position.fromCommit = ""

    ft[target.position.master] = master;
    delete ft[targetVersion];
    
    callback(ft);
  }

  updateNode(fileName, version, content) {
    console.log(`updateNode -- fileName: ${fileName} version: ${version}`)
    var node = this.state.fileTrees[fileName][version];
    Object.assign(node.properties, {
      data: node.properties.base64?window.btoa(content) : content
    });
    this.setState((prev)=>{
      fileTrees: Object.assign({}, prev.fileTrees, {
        [fileName]: Object.assign({}, prev.fileTrees[fileName], {
          [version]: node
        })
      })
    })

    console.log(this.state.fileTrees);
  }

  updateTree(option, fileName, targetVersion) {
    const update = tree => {
      var {fileTrees} = this.state;
      fileTrees[fileName] = tree;
      this.setState({fileTrees: fileTrees})
    };
    var fileTree = this.state.fileTrees[fileName];
    option==="addCommit" ?
    this.addCommit(fileTree, targetVersion, tree=> {update(tree)}) :
    option==="createMaster" ?
    this.createMaster(fileTree, targetVersion, tree=> {update(tree)}) :
    option==="removeMaster" ?
    this.removeMaster(fileTree, targetVersion, tree=>{update(tree)}) :
    option==="removeCommit" ?
    this.removeCommit(fileTree, targetVersion, tree=> {update(tree)}) :
    console.log(`Update Option: ${option} not accepted`);
  }

  removeFile(id) {
    this.setState(prev => ({
      fileTrees: (()=> {
        var temp = prev.fileTrees;
        delete temp[id];
        return temp;
      })(),
      tabs: (()=> {
        var temp = prev.tabs;
        delete temp[id];
        return temp;
      })()
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
            fileName={this.state.active}
            fileTree={this.state.fileTrees[this.state.active]}
            updateNode={this.updateNode}
            updateTree={this.updateTree}
            />
        }
        </div>
      </div>
    )
  }
}

export default FileSpace;