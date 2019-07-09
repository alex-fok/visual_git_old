import React, {Component} from 'react';

class MessageInput extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const messagePrependID = "messagePrepend";
    const {msg, setMsg, isEditable} = this.props;
    return (
      <div className="input-group mb-3">

        <div className="input-group-prepend">
          <span
            className="input-group-text bg-white text-secondary border-secondary"
            id={messagePrependID}
          >Text</span>
        </div>
        <input
          type="text"
          className="form-control"
          value={msg}
          placeholder="[No Message]"
          aria-labelledby={messagePrependID}
          onChange={(e)=> {isEditable ? setMsg(e.target.value) : ""}}
          readOnly={!isEditable}
        />
      </div>
    )
  }
}
export default MessageInput;