#!/usr/bin/env node
'use strict'
var striptags = require('striptags');
var memjs = require('memjs');
var memjsClient = memjs.Client.create();
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.post('/', function(req, res) {
    'use strict';
    var jsonData = {"name": req.body.name,"color": req.body.color,"petName": req.body.petName};
    console.log(req.body);
    console.log('data saved:'+jsonData.toString());
    memjsClient.set(req.body.uniqueIdKey, JSON.stringify(jsonData), {expires:600}, function(err, val){
    });
    memjsClient.get(req.body.uniqueIdKey, function(err,val) {
      console.log('key: %s,value: %s',req.body.uniqueIdKey,val);
    });
    res.sendStatus(200);
});

app.listen(3000);


