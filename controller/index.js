let cors = require('cors')
let app = require('express')()
let http = require('http').createServer(app)
let io = require('socket.io')(http)
let net = require('net')
let shortid = require('shortid')

let corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.get('/', (req, res) => {
	res.end("Welcome on the inmoov controller, feel free to navigate the API at /devices and /browsers to learn more about the current state of the controller.")
})

app.get('/devices', (req, res) => {
	res.json(sockets)
})

app.get('/browsers', (req, res) => {
	res.json(websockets)
})

let sockets = []
let websockets = []

let server = net.createServer((c) => {
	let id = shortid.generate()

	sockets.push({ id: id, socket: c })
	console.log(`Device ${id} connected.`)

	websockets.map((connection) => {
		connection.socket.emit("new zone", { id: id })
	})

	c.on('end', () => {
		console.log(`Device ${id} disconnected.`)
		sockets = sockets.filter((socket) => socket.id !== id)

		websockets.map((connection) => {
			connection.socket.emit("delete zone", { id: id })
		})
	})
})

io.on('connection', (s) => {
	let id = shortid.generate()

	websockets.push({ id: id, socket: s })
	console.log(`Browser ${id} connected.`)

	s.on('move', (data, err) => {
		if(data.hasOwnProperty("zone")) {
			let zone = sockets.filter((socket) => socket.id === data.zone.id)

			if(zone.length !== 0) {
				zone[0].socket.write(JSON.stringify(data))
				console.log(`Browser ${id} requested servo ${data.id} to move to position ${data.value}.`)
			}
		}
	})

	s.on('disconnect', (data, err) => {
		websockets = websockets.filter((websocket) => websocket.id !== id)
		console.log(`Browser ${id} disconnected.`)
	})
})

server.on('error', (err) => {
	throw err
})

server.listen(4000, () => {
	console.log('Socket server listening on 4000')
})

http.listen(8080, () => {
	console.log('Websocket listening on port 8080')
})
