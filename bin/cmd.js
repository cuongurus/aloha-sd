#!/usr/bin/env node

var program = require('commander')
var aloha = require('aloha-sd')

program
    .version('1.0.5')
    .option('-a, --all', 'Browse for all services')
    .option('-l, --lookup <service type>', 'Browse for specific service type')
    .parse(process.argv)

if(program.all && !program.lookup){
    console.log("Browsing for all serices\n")
    aloha.findAll(callback)
} 
if(!program.all && program.lookup){
    console.log("Browsing for "+ program.lookup + "\n")
    aloha.find(callback, program.lookup)
} 
if(program.all && program.lookup) console.log('Too many arguments')

function callback(err, result){
    if(err) console.log(err)

    if(result){
     console.log(result.status ? ('+ '+ result.name + '\t\t' + result.type + '\n\thostname = ' + result.host +
      '\n\taddress = ' + result.ipv4.concat(result.ipv6) + '\n\ttxt = ' + JSON.stringify(result.txt, null, 0)) : ('- ' + result.name + '\t\t' + result.type))  
    }
}