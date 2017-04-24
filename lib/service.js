var dnsTxt = require('dns-txt')()

module.exports = Service

function Service() {
    this.name = '';
    this.type = '';
    this.fqdn = '';
    this.host = '';
    this.port = '';
    this.ipv4 = [];
    this.ipv6 = [];
    this.txt = {};
    this.status = 'Add';
}

Service.prototype.serialize = function (answers, opt, callback) {
    var self = this;

    this.host = opt.host;
    this.ipv4 = opt.ipv4.slice(0);
    this.ipv6 = opt.ipv6.slice(0);
    answers.forEach(function (ans) {
        switch (ans.type) {
            case 'PTR':
                self.fqdn = ans.data;
                self.name = ans.data.split('.', 1)[0];
                self.type = ans.name.slice(0, -6);
                break;

            case 'TXT':
                self.txt = dnsTxt.decode(ans.data);
                break;

            case 'SRV':
                self.port = ans.data.port;
                break;
        }
    });
    if (!opt.host) {
        callback('Required info not given', self.fqdn)
    } else {
        callback(null, self)
    }
};