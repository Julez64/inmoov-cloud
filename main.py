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


def doMove(move):
    print(move)
    if move == "ThumbsUp":
        moveServo(0, 0)
        moveServo(1, 180)
        moveServo(2, 180)
        moveServo(3, 180)
        moveServo(4, 180)
    if move == "FuckYou":
        moveServo(0, 180)
        moveServo(1, 180)
        moveServo(2, 0)
        moveServo(3, 180)
        moveServo(4, 180)
    if move == "CallMe":
        moveServo(0, 0)
        moveServo(1, 180)
        moveServo(2, 180)
        moveServo(3, 180)
        moveServo(4, 0)
        

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    try:
        s.connect((HOST, PORT))
        with s:
            print("Connected: {addr}".format(addr=s.getsockname()))

            while True:
                data = s.recv(2048)
                if not data:
                    break
                try:
                    decodedData = data.decode('utf-8')
                    if "mouvement" in decodedData:
                        data = json.loads(decodedData)
                        doMove(data['mouvement'])
                    else:
                        jdata = json.loads(decodedData)
                        id = jdata['id']
                        value = jdata['value']
                        moveServo(int(id), int(value))
                except Exception as e:
                    print(e)
    except KeyboardInterrupt:
        s.close()
