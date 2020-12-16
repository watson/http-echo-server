#!/usr/bin/env node
'use strict'

const getPort = require('get-port')
const server = require('net').createServer()

let cid = 0
let timeout = 2000

module.exports = server // for testing

onEmit(server, { ignore: ['connection', 'listening', 'error'] }, function (eventName) {
  console.log(`[${new Date().toISOString()}][server] event:`, eventName)
})

server.on('connection', function (c) {
  let gotData = false
  const _cid = ++cid

  console.log(`[${new Date().toISOString()}][server] event: connection (socket#${_cid})`)

  onEmit(c, { ignore: ['lookup', 'error'] }, function (eventName) {
    console.log(`[${new Date().toISOString()}][socket#${_cid}] event:`, eventName)
  })

  c.on('lookup', function (err, address, family) {
    if (err) {
      console.log(`[${new Date().toISOString()}][socket#${_cid}] event: lookup (error: ${err.message})`)
    } else {
      console.log(`[${new Date().toISOString()}][socket#${_cid}] event: lookup (address: ${address}, family: ${family})`)
    }
  })

  c.on('data', function (chunk) {
    console.log('--> ' + chunk.toString().split('\n').join('\n--> '))
    if (!gotData) {
      gotData = true
      c.write('HTTP/1.1 200 OK\r\n')
      c.write('Date: ' + (new Date()).toString() + '\r\n')
      c.write('Connection: close\r\n')
      c.write('Content-Type: text/plain\r\n')
      c.write('Access-Control-Allow-Origin: *\r\n')
      c.write('\r\n')
      setTimeout(function () {
        c.end()
      }, timeout)
    }
    c.write(chunk.toString())
  })

  c.on('error', function (err) {
    console.log(`[${new Date().toISOString()}][socket#${_cid}] event: error (msg: ${err.message})`)
  })
})

server.on('listening', function () {
  const port1 = server.address().port
  console.log(`[${new Date().toISOString()}][server] event: listening (port: ${port1})`)
})

server.on('error', function (err) {
  console.log(`[${new Date().toISOString()}][server] event: error (msg: ${err.message})`)
})

const port = process.argv[2] || process.env.PORT

if (port) {
  server.listen(port)
} else {
  getPort({ port: 3000 }).then(function (port2) {
    server.listen(port2)
  })
}

const delay = process.argv[3] || process.env.DELAY

if (delay) {
  timeout = delay
}

console.log(`[${new Date().toISOString()}][server] delay: ${timeout}ms`)

function onEmit (emitter, opts, cb) {
  const emitFn = emitter.emit
  emitter.emit = function (eventName) {
    if (opts.ignore.indexOf(eventName) === -1) cb.apply(null, arguments)
    return emitFn.apply(emitter, arguments)
  }
}
