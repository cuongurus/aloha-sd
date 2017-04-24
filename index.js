'use strict'

var Browser = require('./lib/browser')

exports.find = function(callback, type){
    return new Browser(callback, type)
}

exports.findAll = function(callback){
    return new Browser(callback, '')
}


