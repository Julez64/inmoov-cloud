import React from "react";
import Servo from "./servo";
import SocketIO from 'socket.io-client'

export default class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Servo servo="0" angle="12" />
        <Servo servo="1" angle="20" />
        <Servo servo="2" angle="0" />
        <Servo servo="3" angle="100" />
        <Servo servo="4" angle="59" />
        <Servo servo="5" angle="38" />
        <Servo servo="6" angle="71" />
      </div>
    );
  }
}
