from adafruit_servokit import ServoKit
import time
import socket
import json
import sys

#Instantiation du robot
robot = ServoKit(channels=16)

#Adresse et port pour le socket
HOST = '127.0.0.1'
PORT = 4000

#Permet de faire bouger le servomoteur
def moveServo(id, angle):
    print("Recieved command: Channel {ch} to angle {angle}".format(
        ch=id, angle=angle))
    #Deplace le servo désiré selon l'angle voulu
    robot.servo[id].angle = angle

#Gestionnaire des mouvements du bras
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
        
#Création du socket
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    try:
        #Connexion au serveur
        s.connect((HOST, PORT))
        with s:
            print("Connected: {addr}".format(addr=s.getsockname()))

            while True:
                #Réception d'information en constance
                data = s.recv(2048)
                if not data:
                    break

                #Si nous avons obtenu de l'information
                try:
                    #Décodage de l'information en UTF-8
                    decodedData = data.decode('utf-8')

                    #Si il s'agit d'un mouvement
                    if "mouvement" in decodedData:
                        #Décodage JSON et application du mouvement
                        data = json.loads(decodedData)
                        doMove(data['mouvement'])
                    else:
                        #On arrive ici pour déplacer un seul doigt, on décode le JSON
                        jdata = json.loads(decodedData)
                        id = jdata['id']
                        value = jdata['value']

                        #Déplacement du doigt
                        moveServo(int(id), int(value))
                except Exception as e:
                    print(e)
    except KeyboardInterrupt:
        #Nous permet d'arrêter le programme à tout moment en s'assurant de refermer la connexion
        s.close()
