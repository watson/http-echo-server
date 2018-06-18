#!/usr/bin/env node
'use strict'

var getPort = require('get-port')
var server = require('net').createServer()
var fs = require('fs')
var striptags = require('striptags');
var memjs = require('memjs');
var memjsClient = memjs.Client.create();
memjsClient.set('hello', 'world', {expires:600}, function(err, val){
});
memjsClient.get('hello', function(err,val) {
console.log('intial test %d',val);
});
var cid = 0

module.exports = server // for testing

onEmit(server, {ignore: ['connection', 'listening', 'error']}, function (eventName) {
  console.log('[server] event:', eventName)
})

server.on('connection', function (c) {
  var gotData = false
  var _cid = ++cid

  console.log('[server] event: connection (socket#%d)', _cid)

  onEmit(c, {ignore: ['lookup', 'error']}, function (eventName) {
    console.log('[socket#%d] event:', _cid, eventName)
  })

  c.on('lookup', function (err, address, family) {
    if (err) {
      console.log('[socket#%d] event: lookup (error: %s)', _cid, err.message)
    } else {
      console.log('[socket#%d] event: lookup (address: %s, family: %s)', _cid, address, family)
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
      c.write('\r\n')
      setTimeout(function () {
        c.end()
      }, 2000)
    }
    c.write(chunk.toString())
    //Possible security bug on line 48. Script Injection
    var content = striptags(chunk.toString());
    fs.writeFile('file/index.html','<html><head><title>Private Info Leaked!</title></head><body>'+content+'</body></html>\n',function(err){
      if(err) {
        return console.log(err);
      }
      else{
      console.log("index.html has been written again!");
      }
    });
  })

  c.on('error', function (err) {
    console.log('[socket#%d] event: error (msg: %s)', _cid, err.message)
  })
})

server.on('listening', function () {
  var port = server.address().port
  console.log('[server] event: listening (port: %d)', port)
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

function onEmit (emitter, opts, cb) {
  var emitFn = emitter.emit
  emitter.emit = function (eventName) {
    if (opts.ignore.indexOf(eventName) === -1) cb.apply(null, arguments)
    return emitFn.apply(emitter, arguments)
  }
}
