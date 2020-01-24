from adafruit_servokit import ServoKit
import time
import socket

robot = ServoKit(channels=16)

HOST = "127.0.0.1"
PORT = 4000

def moveServo(id, angle):
	print("Recieved command: Channel {ch} to angle {angle}".format(ch=id, angle=angle))
	robot.servo[id].angle = angle

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    try:
        s.bind((HOST, PORT))
        s.listen()
        conn, addr = s.accept()
        with conn:
            print("Connected: {addr}".format(addr=addr))
            while True:
                data = conn.recv(1024)
                if not data:
                    break

                data = str(data).split("(")[1].split(")")[0].split(",")
                moveServo(int(data[0]),int(data[1]))
    except KeyboardInterrupt:
        s.close()
