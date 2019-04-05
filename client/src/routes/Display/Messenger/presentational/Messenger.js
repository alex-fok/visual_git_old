import React, {Component} from 'React';

class Messenger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: document.createElement("LI")
    }

    this.setStatechat.appendChildElement(createChatItem(this.props.message));

    this.props.socket.on('message', (message) => {
      if (message) {
        const {chat} = this.state;
        this.setState({
          chat: this.addChatItem(message, chat)
        })
      }
    });
  }

  createChatItem(message) {
    if(message) {
      <li className="list-group-item">{message}</li>
    } else {
      <li className="list-group-item"></li>
    }
  }

  render(){

  }

}

export default Messenger;