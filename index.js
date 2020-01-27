let app = require('express')()
let http = require('http').createServer(app)
let io = require('socket.io')(http)
let net = require('net')


let server = net.createServer((c) => {
	
	// 'connection' listener.
	console.log('client connected ')
	c.setMaxListeners(0)
	c.on('end', () => {
		console.log('client disconnected')
	})

	io.on('connection', (socket) => {

		socket.on('move', (data, err) => {
			c.write(`(${data.id},${data.value})`)

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
