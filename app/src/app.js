import React from 'react'
import Zone from './components/zone'
import SocketIO from 'socket.io-client'

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			endpoint: 'http://localhost:8080',
			socket: undefined,
			zoneId: '',
			zoneName: '',
			errorMessage: undefined,
			zones: JSON.parse(localStorage.getItem('zones')) || []
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleAdd = this.handleAdd.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
	}
	handleAdd(id) {
		let zones = this.state.zones
		let zoneExists = false

		zones.map((zone) => {
			if (zone.id === this.state.zoneId) {
				zoneExists = true
			}
		})

		if (zoneExists === false) {
			zones.push({ id: id || this.state.zoneId, name: id || this.state.zoneName })

			this.setState({
				zones: zones,
				errorMessage: undefined
			})
		} else {
			this.setState({
				errorMessage: 'Zone already exists.'
			})
		}

		localStorage.setItem('zones', JSON.stringify(zones))
	}
	handleChange(event) {
		const target = event.target
		const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name

		this.setState({
			[name]: value
		})
	}
	handleDelete(id) {
		let zones = this.state.zones
		let deletedZone = null

		deletedZone = zones.filter((zone) => zone.id === id)

		console.log(deletedZone)

		zones = zones.filter((zone) => {
			return zone.id !== id
		})

		this.setState({
			zones: zones
		})

		localStorage.removeItem(id)
		localStorage.setItem('zones', JSON.stringify(zones))
	}
	componentDidMount() {
		let socket = SocketIO(this.state.endpoint).connect()

		socket.on('new zone', (data, err) => {
			if (!err) {
				this.handleAdd(data.id)
			}
		})

		socket.on('delete zone', (data, err) => {
			console.log(data)
			if (!err) {
				this.handleDelete(data.id)
			}
		})

		this.setState({
			socket: socket
		})
	}
	render() {
		return (
			<>
				<div className="input-container">
					<div className="input-group">
						<label htmlFor="zoneId">Zone ID</label>
						<input
							type="text"
							id="zoneId"
							name="zoneId"
							value={this.state.zoneId}
							onChange={this.handleChange}
						/>
					</div>
					<div className="input-group">
						<label htmlFor="zoneName">Zone name</label>
						<input
							type="text"
							id="zoneName"
							name="zoneName"
							value={this.state.zoneName}
							onChange={this.handleChange}
						/>
					</div>
					<button className="add-button" onClick={this.handleAdd}>
						Add zone
					</button>
				</div>
				{this.state.errorMessage !== undefined && (
					<p className="error-message">{this.state.errorMessage}</p>
				)}
				{this.state.zones.map((zone) => (
					<Zone
						key={zone.id}
						socket={this.state.socket}
						zone={zone}
						handleDelete={this.handleDelete}
					/>
				))}
			</>
		)
	}
}
