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
        <Servo servo="0" angle="0" socket={this.state.socket} />
      </div>
    );
  }
  componentDidMount() {
    this.setState({socket: SocketIO(this.state.endpoint).connect()})
  }
}
