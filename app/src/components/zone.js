import React, { Component } from 'react'
import Servo from './servo'

import './styles/zone.css'

export default class Zone extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: this.props.name,
			servos: JSON.parse(localStorage.getItem(this.props.zone.id)) || [],
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

		localStorage.setItem(this.props.zone.id, JSON.stringify(servos))
	}
	handleDelete(id) {
		let servos = this.state.servos

		servos = servos.filter((servo) => {
			return servo.id !== id
		})

		this.setState({
			servos: servos
		})

		console.log(servos)

		localStorage.setItem(this.props.zone.id, JSON.stringify(servos))
	}
	render() {
		return (
			<>
				<div className="zone">
					<h1>{`ID: ${this.props.zone.id} - ${this.props.zone.name}`}</h1>
					{this.state.errorMessage !== undefined && (
						<p className="error-message">{this.state.errorMessage}</p>
					)}
					<div className="container">
						<div className="servo-container servo-form-container">
							<div>
								<label htmlFor="servoId">Channel</label>
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
								<label htmlFor="servoValue">Initial Angle</label>
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
							<button className="add-button" onClick={this.handleNewServo}>Add Servo</button>
							<button
								className="delete-button"
								onClick={() => {
									this.props.handleDelete(this.props.zone.id)
								}}>
								Delete
							</button>
						</div>

						{this.state.servos.map((value) => (
							<Servo
								key={value.id}
								zone={this.props.zone}
								servo={value.id}
								angle={value.angle}
								socket={this.props.socket}
								handleDelete={this.handleDelete}
							/>
						))}
					</div>
				</div>
			</>
		)
	}
}
