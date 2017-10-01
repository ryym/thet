import * as React from 'react';
import * as classnames from 'classnames';

const ENTER_KEY_CODE = 13;

type Props = {
  onSave: (text: string) => void,
  text: string,
  placeholder?: string,
  editing?: boolean,
  newTodo?: boolean,
};

type State = {
  text: string,
};

export default class TodoTextInput extends React.Component<Props, State> {
  state = {
    text: this.props.text,
  };

  handleSubmit = (event: any) => {
    const text = event.target.value.trim();
    if (event.keyCode === ENTER_KEY_CODE) {
      this.props.onSave(text);
      this.setState({ text: '' });
    }
  }

  handleChange = (event: any) => {
    this.setState({ text: event.target.value });
  }

  handleBlur = (event: any) => {
    if (!this.props.newTodo) {
      this.props.onSave(event.target.value);
    }
  }

  render() {
    return (
      <input
        className={classnames({
          'edit': this.props.editing,
          'new-todo': this.props.newTodo,
        })}
        type="text"
        autoFocus
        placeholder={this.props.placeholder}
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit}
      />
    );
  }
}
