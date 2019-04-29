var fs = require("fs")
const readLastLines = require('read-last-lines')
const request = require('request')
const help = require('./../services/help')

module.exports = class Log {
    constructor(roleDir, alarmUrl) {
        this.alarmUrl = alarmUrl
        this.roleDir = roleDir
        help.crateIfNotExist(this.roleDir)
        this.tmpDir = roleDir + '/unautorized'
        help.crateIfNotExist(this.tmpDir)
    }
    add(id, msg) {
        if (!id) return
        let resultMsg = `[${this._datetime()}] ${msg}`
        if ((('' + id).indexOf('tg') + 1) && (('' + id).indexOf('fb') + 1) && (('' + id).indexOf('vk') + 1))
            this._addRowToTmp(id, resultMsg)
        else
            this._addRowToUser(id, resultMsg)
    }
    merge(id_tmp, id) {
        let resultMsg = `[${this._datetime()}] [WARNING:МИИГРАЦИЯ ДАННЫХ из ${id_tmp}]\n`
        if (this._isTmpExists(id_tmp))
            resultMsg += this._readAllFromTmpAndRemove(id_tmp)
        else
            resultMsg += `Попытка смержить из несуществующего временного id=${id_tmp}`
        this._addRowToUser(id, resultMsg)
    }
    alarm(user_id, name, curators, count) {
        this._getLastRows(user_id, count, (text) => {
            if (text)
                for (let curId of curators)
                    request.post(this.alarmUrl + '/' + curId, { json: { msg: `${user_id}:${name}\n${text}` } })
        })
    }

    _getLastRows(id, count, callback) {
        let file = `${this.roleDir}/${id}.log`
        if (fs.existsSync(file))
            readLastLines.read(file, count).then((lines) => callback(lines));
        else {
            file = `${this.tmpDir}/${id}.log`
            if (fs.existsSync(file))
                readLastLines.read(file, count).then((lines) => callback(lines));
        }
        callback(false)
    }
    _addRowToUser(id, msg) {
        let file = `${this.roleDir}/${id}.log`
        if (fs.existsSync(file))
            fs.appendFileSync(file, '\n' + msg)
        else
            fs.writeFileSync(file, msg)
    }
    _isUserExists(id) {
        return fs.existsSync(`${this.roleDir}/${id}.log`)
    }
    _addRowToTmp(id, msg) {
        let file = `${this.tmpDir}/${id}.log`
        if (fs.existsSync(file))
            fs.appendFileSync(file, '\n' + msg)
        else
            fs.writeFileSync(file, msg)
    }
    _isTmpExists(id) {
        return fs.existsSync(`${this.tmpDir}/${id}.log`)
    }
    _readAllFromTmpAndRemove(id) {
        let text = fs.readFileSync(`${this.tmpDir}/${id}.log`)
        fs.unlinkSync(`${this.tmpDir}/${id}.log`)
        return text
    }
    _datetime() {
        return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}

// instance.add('tg34343434', '-> Авторизация')
// instance.merge('tg34343434', 45)
// instance.add(45, '-> Авторизация')
// instance.alarm(45,'Вася', [56,54])