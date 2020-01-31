from adafruit_servokit import ServoKit
import time
import socket
import json
import sys

robot = ServoKit(channels=16)

HOST = sys.argv[1] or '127.0.0.1'
PORT = int(sys.argv[2]) or 4000


def moveServo(id, angle):
    print("Recieved command: Channel {ch} to angle {angle}".format(
        ch=id, angle=angle))
    robot.servo[id].angle = angle


with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    try:
        s.connect((HOST, PORT))
        with s:
            print("Connected: {addr}".format(addr=s.getsockname()))

            while True:
                data = s.recv(1024)
                if not data:
                    break
                try:
                    jdata = json.loads(data.decode('utf-8'))
                    id = jdata['id']
                    value = jdata['value']
                    moveServo(int(id), int(value))
                except Exception:
                    print("Error detected")
    except KeyboardInterrupt:
        s.close()
