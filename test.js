'use strict'

var assert = require('assert')
var net = require('net')

var server = require('./server')

server.on('listening', function () {
  var port = server.address().port
  var client = net.createConnection({port: port})
  var result = ''
  client.on('data', function (chunk) {
    result += chunk
  })
  client.on('end', function () {
    var lines = result.split('\r\n')
    assert.equal(lines.length, 6)
    assert.equal(lines.shift(), 'HTTP/1.1 200 OK')
    assert.equal(lines.shift().slice(0, 6), 'Date: ')
    assert.equal(lines.shift(), 'Connection: close')
    assert.equal(lines.shift(), 'Content-Type: text/plain')
    assert.equal(lines.shift(), '')
    assert.equal(lines.shift(), 'hello world')
    server.close()
  })
  client.end('hello world')
})
