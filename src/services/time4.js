const fs = require('fs')
const help = require('./help')

module.exports = class Time4 {
    constructor(conf) {
        this.thread_id = conf.thread_id
        help.crateIfNotExist(conf.dir)
        this.config = conf.dir + '/currentday'
        if (!fs.existsSync(this.config)) {
            fs.writeFileSync(this.config, 0)
        }
    }
    setday(daynum) {
        fs.writeFileSync(this.config, daynum)
    }
    nextday() {
        let day = this.today()
        day++
        fs.writeFileSync(this.config, day)
        return day
    }
    isThreadRun() {
        return this.today() > 0
    }

    today() {
        return Number(fs.readFileSync(this.config))
    }

}