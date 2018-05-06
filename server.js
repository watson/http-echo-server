'use strict'

var getPort = require('get-port')
var server = require('net').createServer()

var cid = 0

server.on('connection', function (c) {
  var _cid = ++cid
  console.log('[server] event: connection (socket#%d)', _cid)
  var gotData = false
  c.on('lookup', function (err, address, family) {
    if (err) {
      console.log('[socket#%d] event: lookup (error: %s)', _cid, err.message)
    } else {
      console.log('[socket#%d] event: lookup (address: %s, family: %s)', _cid, address, family)
    }
  })
  c.on('data', function (chunk) {
    console.log('[socket#%d] event: data', _cid)
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
    console.log('[socket#%d] event: end', _cid)
  })
  c.on('timeout', function () {
    console.log('[socket#%d] event: timeout', _cid)
  })
  c.on('drain', function () {
    console.log('[socket#%d] event: drain', _cid)
  })
  c.on('error', function (err) {
    console.log('[socket#%d] event: error (msg: %s)', _cid, err.message)
  })
  c.on('close', function () {
    console.log('[socket#%d] event: close', _cid)
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
