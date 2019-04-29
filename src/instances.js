const UniBot = require('./unibot')
const Log = require('./services/Log')
const Server = require('./server/server')
const conf = require('../config/config')
const Time4 = require('./services/time4')
module.exports = {
    userBot: new UniBot(conf.userBot),
    userLog: new Log(conf.services.log.users, 'http://0.0.0.0:2020/alarm-url'),
    curatorBot: new UniBot(conf.curatorBot),
    curatorLog: new Log(conf.services.log.curators, 'http://0.0.0.0:2020/alarm-url'),
    server: new Server('https://api.swift-english.com/api/v1'),
    help: require('./services/help'),
    time4: new Time4(conf.services.time4)
}