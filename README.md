# aloha-sd
A Bonjour/Zeroconf protocol implementation in pure JavaScript. Publish services on the local network or discover existing services using multicast DNS.

# Installation
npm install -g aloha-sd

# Usage
```js
var aloha = require('aloha-sd')

aloha.find((err, result) =>{
    if (err) console.log(err)

    if(result){
        console.log("Found service: "+ JSON.stringify(result,null,4))
    }
},'_http._tcp')
```

# API
# Initializing
```js
var aloha = require('aloha-sd')
```

### Browsing
#### `var finder = aloha.findAll(callback)`
Browser for all services, regardless of the type
### `var finder = aloha.find(callback,service_type)`
Browser for all services with given service_type


| Type | Property | Description |
| --- | --- | --- |
| Function | callback | called when a service has been found.</br>The *callback* parameter should be a function that looks like this:</br>function (string error, Service result){...};</br><table><tr><td>String</td><td>error</td><td>The error return from browsing</td></tr><tr><td>Service Object</td><td>result</td><td>The service return from browsing</td></tr></table> |
| String | service_type | Example: '_http._tcp'. List of known service_types [here](https://github.com/cuongurus/Zeroconf-for-Chrome/blob/master/test/browser/service-types.js)</br>Let it null for browse all. |

### `finder.shutdown()`
Stop looking for matching services.

## Service
Service look like this
```js
{
name: string,
type: string,
fqdn: string,
host: string,
port: string,
ipv4: [],
ipv6: [],
txt: object,
status: string
}
```

### `Service.status`
A string indicating if the service is currently added ('Add') or removed ('Rmv')
## Publish
On development.