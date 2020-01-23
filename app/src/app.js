import React from "react";
import Servo from "./servo";
import SocketIO from 'socket.io-client'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      endpoint: 'http://localhost:8080',
      servos: [],
      socket: undefined
    }
  }
  render() {
    return (
      <div className="container">
        <Servo servo="0" angle="12" socket={this.state.socket} />
        <Servo servo="1" angle="20" socket={this.state.socket} />
        <Servo servo="2" angle="0" socket={this.state.socket} />
        <Servo servo="3" angle="100" socket={this.state.socket} />
        <Servo servo="4" angle="59" socket={this.state.socket} />
        <Servo servo="5" angle="38" socket={this.state.socket} />
        <Servo servo="6" angle="71" socket={this.state.socket} />
      </div>
    );
  }
  componentDidMount() {
    this.setState({socket: SocketIO(this.state.endpoint).connect()})
  }
}
