from adafruit_servokit import ServoKit
import time
import socket

robot = ServoKit(channels=16)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    try:
        s.bind((HOST, PORT))
        s.listen()
        conn, addr = s.accept()
        with conn:
            print('Connected by', addr)
            while True:
                data = conn.recv(1024)
                if not data:
                    break

                print(type(data))
    except KeyboardInterrupt:
        s.close()
