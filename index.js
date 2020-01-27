let app = require('express')()
let http = require('http').createServer(app)
let io = require('socket.io')(http)
let net = require('net')

let server = net.createServer((c) => {
	// 'connection' listener.
	console.log('client connected ')
	let connected = true
	c.setMaxListeners(0)
	c.on('end', () => {
		connected = false
		console.log('client disconnected')
	})

	io.on('connection', (socket) => {
		socket.on('move', (data, err) => {
			if (connected) {
				c.write(JSON.stringify(data))
			}
		})

		socket.on('disconnect', (data, end) => {
			c.end()
		})
	})
})

server.on('error', (err) => {
	throw err
})

server.listen(4000, () => {
	console.log('server bound on 4000')
})

http.listen(8080, () => {
	console.log('server listening on port 8080')
})
