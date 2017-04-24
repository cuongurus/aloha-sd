'use strict';

// var os = require('os')
var dgram = require('dgram')

var dnsTxt = require('dns-txt')
var packet = require('dns-packet')
var Service = require('./service')

var TLD = '.local';
var WILDCARD = '_services._dns-sd._udp' + TLD;

module.exports = Browser

function Browser(callback, type) {
    this.callback_ = callback;
    this.type_ = WILDCARD;
    if (type.length != 0) this.type_ = type + TLD;
    this.found = false;
    this.servTypes = [];
    this.socketInfo;
    this.services = [];
    var self = this;

    this.socket = dgram.createSocket({
        type: 'udp4',
        reuseAddr: true
    })

    this.onReceiveListener_ = this.onReceive_.bind(this);
    this.socket.on('message', this.onReceiveListener_);
    this.socket.on('error', function (err) {
        console.log(err.message)
    })

    this.socket.on('listening', function () {
        self.socket.setMulticastTTL(255)
        self.socket.addMembership('224.0.0.251')
        self.socket.setMulticastLoopback(true)
    })
    this.socket.bind(5353, '0.0.0.0', function (err) {
        if (!err) {
            self.broadcast([{
                type: 'PTR',
                name: self.type_
            }])
        }
    })

}

Browser.prototype.broadcast = function (questions_) {
    var self = this;
    var buf = packet.encode({
        type: 'query',
        id: 0,
        flags: 0 << 8,
        questions: questions_
    });

    this.socket.send(buf, 0, buf.length, 5353, '224.0.0.251', (err) => {
        self.callback_(err, null);
    });
}

Browser.prototype.onReceive_ = function (message, rinfo) {
    var query = packet.decode(message);
    if (query.type == 'response') {
        var ans = (query.answers).concat(query.additionals);
        var self = this;
        self.found = true;
        var boo = true;
        ans.some(function (n) {
            if (n.name != WILDCARD) {
                boo = false
                return false
            }
        })

        if (boo) {
            var q = [];
            ans.forEach(function (answer) {
                if (self.servTypes.indexOf(answer.data) != -1) {
                    return;
                } else {
                    self.servTypes.push(answer.data);
                    q.push({
                        type: 'PTR',
                        name: answer.data
                    })
                }
            })
            self.broadcast(q)

        } else {
            var i = 0;
            var opt = {
                host: '',
                ipv4: [],
                ipv6: []
            };
            var j = 0;
            var rmv = false;

            while (j < ans.length) {
                if (ans[j].type == 'AAAA') {
                    opt.host = ans[j].name;
                    opt.ipv6.push(ans[j].data);
                    ans.splice(j, 1);
                    j--;
                } else if (ans[j].type == 'A') {
                    opt.host = ans[j].name;
                    opt.ipv4.push(ans[j].data);
                    ans.splice(j, 1);
                    j--;
                } else if (ans[j].type == 'NSEC' || ans[j].name == WILDCARD) {
                    ans.splice(j, 1)
                    j--
                } else if (ans[j].ttl == 0 && ans[j].type == 'PTR') {
                    rmv = true;
                    if (self.type_ == WILDCARD || self.type_ == ans[j].name) {
                        var s = new Service()
                        s.fqdn = ans[j].data
                        s.name = ans[j].data.split('.', 1)[0];
                        s.type = ans[j].name.slice(0, -6);
                        s.status = 'Rmv'
                        var index = self.services.indexOf(s.fqdn)
                        if (index >= 0) {
                            self.services.splice(index, 1)
                            setTimeout(function () {
                                self.callback_(null, s)
                            }, 6000)
                        }
                    }
                }
                j++;
            };

            if (!rmv) {
                while (i < ans.length) {
                    var rec = ans.slice(i, i + 3);
                    // console.log(rec)
                    var S = new Service();
                    S.serialize(rec, opt, function (err, ret) {
                        if (!err) {
                            if (ret.type + '.local' == self.type_ || self.type_ == WILDCARD) {
                                // console.log('index '+self.services.indexOf(ret.fqdn))
                                if (self.services.indexOf(ret.fqdn) == -1) {
                                    // console.log("add")
                                    self.services.push(ret.fqdn);
                                    // self.services[ret.fqdn] = true
                                    self.callback_(null, ret);
                                }
                            }

                        } else {
                            var q = [{
                                type: 'PTR',
                                name: ret
                            }]
                            self.broadcast(q)
                        }
                    });


                    i += 3;
                }
            }


        }
    }
}

Browser.prototype.shutdown = function () {
    socket.close();
}