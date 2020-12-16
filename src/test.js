'use strict'

const assert = require('assert')
const net = require('net')

const server = require('./index')

server.on('listening', function () {
  const port = server.address().port
  const client = net.createConnection({ port: port })
  let result = ''
  client.on('data', function (chunk) {
    result += chunk
  })
  client.on('end', function () {
    const lines = result.split('\r\n')
    assert.strictEqual(lines.length, 7)
    assert.strictEqual(lines.shift(), 'HTTP/1.1 200 OK')
    assert.strictEqual(lines.shift().slice(0, 6), 'Date: ')
    assert.strictEqual(lines.shift(), 'Connection: close')
    assert.strictEqual(lines.shift(), 'Content-Type: text/plain')
    assert.strictEqual(lines.shift(), 'Access-Control-Allow-Origin: *')
    assert.strictEqual(lines.shift(), '')
    assert.strictEqual(lines.shift(), 'hello world')
    server.close()
  })
  client.end('hello world')
})
