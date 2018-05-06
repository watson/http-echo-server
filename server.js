'use strict'

var getPort = require('get-port')
var server = require('net').createServer()

server.on('connection', function (c) {
  console.log('[server] event: connection')
  var gotData = false
  c.on('lookup', function (err, address, family) {
    if (err) {
      console.log('[connection] event: lookup (error: %s)', err.message)
    } else {
      console.log('[connection] event: lookup (address: %s, family: %s)', address, family)
    }
  })
  c.on('data', function (chunk) {
    console.log('[connection] event: data')
    console.log('--> ' + chunk.toString().split('\n').join('\n--> '))
    if (!gotData) {
      gotData = true
      c.write('HTTP/1.1 200 OK\r\n')
      c.write('Date: ' + (new Date()).toString() + '\r\n')
      c.write('Connection: close\r\n')
      c.write('Content-Type: text/plain\r\n')
      c.write('\r\n')
      setTimeout(function () {
        c.end()
      }, 2000)
    }
    c.write(chunk.toString())
  })
  c.on('end', function () {
    console.log('[connection] event: end')
  })
  c.on('timeout', function () {
    console.log('[connection] event: timeout')
  })
  c.on('drain', function () {
    console.log('[connection] event: drain')
  })
  c.on('error', function (err) {
    console.log('[connection] event: error (msg: %s)', err.message)
  })
  c.on('close', function () {
    console.log('[connection] event: close')
  })
})

server.on('listening', function () {
  var port = server.address().port
  console.log('[server] event: listening (port: %d)', port)
})

server.on('close', function () {
  console.log('[server] event: close')
})

server.on('error', function (err) {
  console.log('[server] event: error (msg: %s)', err.message)
})

if (process.env.PORT) {
  server.listen(process.env.PORT)
} else {
  getPort({port: 3000}).then(function (port) {
    server.listen(port)
  })
}
