import React from 'react'
import Servo from './servo'
import SocketIO from 'socket.io-client'

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			endpoint: 'http://localhost:8080',
			servos: [{ id: 0, angle: 0 }],
			socket: undefined,
			servoId: 0,
			servoAngle: 0,
			errorMessage: undefined
		}

		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleNewServo = this.handleNewServo.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
	}
	handleInputChange(event) {
		const target = event.target
		const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name

		this.setState({
			[name]: value
		})
	}
	handleNewServo() {
		let servos = this.state.servos
		let servoExists = false

		servos.map((servo) => {
			if (servo.id === this.state.servoId) {
				servoExists = true
			}
		})

		if (servoExists === false) {
			servos.push({ id: this.state.servoId, angle: this.state.servoAngle })

			this.setState({
				servos: servos,
				errorMessage: undefined
			})
		} else {
			this.setState({
				errorMessage: 'Servo channel is already in use.'
			})
		}
	}
	handleDelete(id) {
		let servos = this.state.servos

		servos = servos.filter((servo) => {
			return servo.id !== id
		})

		this.setState({
			servos: servos
		})
	}
	render() {
		return (
			<>
				<div className="servo-header">
					<div class="servo-form-container">
						<div>
						<label for="servoId">Channel</label>
						<input
							type="number"
							id="servoId"
							name="servoId"
							min="0"
							value={this.state.servoId}
							onChange={this.handleInputChange}
						/>
						</div>
						<div>
						<label for="servoValue">Initial Angle</label>
						<input
							type="number"
							id="servoAngle"
							name="servoAngle"
							min={0}
							max={180}
							value={this.state.servoAngle}
							onChange={this.handleInputChange}
						/>
						</div>
					</div>
					<button onClick={this.handleNewServo}>Add Servo</button>
					{this.state.errorMessage !== undefined && (
						<p class="error-message">{this.state.errorMessage}</p>
					)}
				</div>
				<div className="container">
					{this.state.servos.map((value) => (
						<Servo
							servo={value.id}
							angle={value.angle}
							socket={this.state.socket}
							handleDelete={this.handleDelete}
						/>
					))}
				</div>
			</>
		)
	}
	componentDidMount() {
		this.setState({ socket: SocketIO(this.state.endpoint).connect() })
	}
}
