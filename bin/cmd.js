#!/usr/bin/env node

var program = require('commander')
var aloha = require('aloha-sd')

program
    .version('1.0.3')
    .option('-a, --all', 'Browse for all services')
    .option('-l, --lookup <service type>', 'Browse for specific service type')
    .parse(process.argv)

if(program.all && !program.lookup){
    console.log("Browsing for all serices\n" +
    "A/R\tName\tService Type\t\tHost\tPort")
    aloha.findAll(callback)
} 
if(!program.all && program.lookup){
    console.log("Browsing for "+ program.lookup + "\n" +
    "A/R\tName\tService Type\t\tHost\tPort")
    aloha.find(callback, program.lookup)
} 
if(program.all && program.lookup) console.log('Too many arguments')

function callback(err, result){
    if(err) console.log(err)

    if(result){
     console.log(result.status + '\t' + result.name + '\t' + result.type + '\t' + result.host + '\t' + result.port + (result.status=='Rmv' ? '':'\n\t-IPv4: '  + result.ipv4 + '\n\t-IPv6: '+ result.ipv6 + '\n\t-TXT: ' +JSON.stringify(result.txt,null,0)))   
    }
}