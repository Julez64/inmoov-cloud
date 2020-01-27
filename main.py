from adafruit_servokit import ServoKit
import time
import socket
import json

robot = ServoKit(channels=16)

HOST = "127.0.0.1"

def moveServo(id, angle):
    print("Recieved command: Channel {ch} to angle {angle}".format(ch=id, angle=angle))
    robot.servo[id].angle = angle

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    try:
        s.connect((HOST, 4000))
        with s:
            print("Connected: {addr}".format(addr=s.getsockname()))
            while True:
                data = s.recv(1024)
                print('Received stuff')
                if not data:
                    break

                jdata = json.loads(data.decode('utf-8'))
                id = jdata['id']
                value = jdata['value']

                moveServo(int(id), int(value))

    except KeyboardInterrupt:
        s.close()
