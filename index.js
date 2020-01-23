let app = require('express')()
let http = require('http').createServer(app)
let io = require('socket.io')(http)
let net = require('net')

app.get("/", (req, res) => {
	res.end("hello world")
})

io.on('connection', (socket) => {
	let s = net.Socket({ allowHalfOpen: true })
	s.connect(4000, '127.0.0.1')

	socket.on('move', (data, err) => {
		s.write(`(${data.id},${data.value})`)
	})

	socket.on('disconnect', (data, end) => {
		s.end()
	})
})

http.listen(8080, () => {
	console.log("server listening on port 8080")
})
