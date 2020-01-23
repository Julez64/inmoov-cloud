import React from 'react'
import './servo'

class Servo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            angle: this.props.angle
        }
        this.onAngleChange = this.onAngleChange.bind(this)
    }
    onAngleChange(event) {
        this.setState({angle: event.target.value})
    }
    render() {
        return (
            <div className='servo-container'>
                <h1>Servo #{this.props.servo}</h1>
                <h3>Angle: {this.state.angle}</h3>
                <br />
                <input type='range' min='0' max='180' value={this.state.angle} onChange={this.onAngleChange} step='1'/>
            </div>
        )
    }
}

export default Servo