import React, { Component } from 'react'

export default class Explore extends Component {
  // static propTypes = {
  //   value: PropTypes.string.isRequired,
  //   onChange: PropTypes.func.isRequired
  // }

  constructor(props) {
    super(props)
    this.state = { value: props.value }
  }

  // To set value from URL
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value })
    }
  }

  changeValue = (event) => this.setState({
    value: event.target.value
  })

  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.handleGoClick()
    }
  }

  handleGoClick = () => {
    this.props.onChange(this.state.value)
  }

  render() {
    return (
      <div>
        <p>Type a username or repo full name and hit 'Go':</p>
        <input
          size="45"
          ref="input"
          value={this.state.value}
          onChange={this.changeValue}
          onKeyUp={this.handleKeyUp}
          id="explore-input"
        />
        <button onClick={this.handleGoClick} id="explore-go">
          Go!
        </button>
      </div>
    )
  }
}

