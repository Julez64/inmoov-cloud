import React from 'react'
import './servo'

class Servo extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			angle: this.props.angle
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleEmit = this.handleEmit.bind(this)
	}
	componentDidMount() {
		if (this.props.socket !== undefined) {
			this.props.socket.emit('move', { id: this.props.servo, value: this.state.angle })
		}
	}
	handleChange(event) {
		this.setState({ angle: event.target.value })
	}
	handleEmit() {
		if (this.props.socket !== undefined) {
			this.props.socket.emit('move', { id: this.props.servo, value: this.state.angle })
		}
	}
	render() {
		return (
			<div className="servo-container">
				<h1>Channel {this.props.servo}</h1>
				<h3>{this.state.angle}°</h3>
				<br />
				<input
					type="range"
					min="0"
					max="180"
					value={this.state.angle}
					onChange={this.handleChange}
					step="1"
					onMouseUp={this.handleEmit}
					onKeyDown={this.handleEmit}
				/>
			</div>
		)
	}
}

export default Servo
