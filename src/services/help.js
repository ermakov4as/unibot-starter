const request = require('request')

Number.prototype.cut = function (digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};
Array.prototype.r3 = function () {
    if (this.length == 1)
        return [[this[0]]]
    if (this.length == 2)
        return [[this[0]], [this[1]]]
    let cur = 0
    let res = [[], [], []]
    for (a of this)
        res[(cur++) % 3].push(a)
    return res
}
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}
String.prototype.getValues = function (separate) {
    let str = this
    let res = []
    let start_pos = str.indexOf(separate) + 1;
    let end_pos = str.indexOf(separate, start_pos);

    while (end_pos + 1) {
        res.push(str.substring(start_pos, end_pos))
        str = str.substring(end_pos + 1, str.length)
        start_pos = str.indexOf(separate) + 1;
        end_pos = str.indexOf(separate, start_pos);
    }
    return res
}
Array.prototype.shuffle = function () {
    let array = this
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function getTimeH(from, to, split, rows, prefix) {
    let diff = ((to - from) / (split - 1)).cut(5)
    let col = Math.floor(split / rows)
    let res = []
    let i = 0
    let cur = from

    res[i] = []
    let j = 0
    while (cur <= to) {
        let h = cur.cut(0)
        let m = Math.round((cur % 1).cut(5) * 60)
        m = m - m % 30
        if (m == 60) {
            m = 0
            h += 1
        }
        if (m == 1)
            m = 0
        if (m < 10) {
            m = '0' + m
        }
        cur += diff
        res[i].push(`${prefix}${h}:${m}`)
        j++
        if (j == col && cur <= to) {
            i++
            j = 0
            res[i] = []
        }
    }
    return res
}
function timeFromNum(num) {
    let h = num.cut(0)
    let m = Math.round((num % 1).cut(5) * 60)
    if (m == 60) {
        m = 0
        h += 1
    }
    m = m
    if (m == 1)
        m = 0
    if (m < 10) {
        m = '0' + m
    }
    return `${h}:${m}`
}
function buildAlarm(usersLog, curatorBot) {
    return function (id, name, count) {
        if (!id || !name)
            return
        curatorBot.getAllUsers(['id'], (users) => {
            user_ids = []
            for (let u of users)
                user_ids.push(u.id)
            if (user_ids.length)
                usersLog.alarm(id, name, user_ids, count)
        })
    }
}

const fs = require('fs')
function crateIfNotExist(fulldir) {
    let full = fulldir.split('/')
    fullname = './' + full.shift()
    while (full.length) {
        fullname += '/' + full.shift()
        if (!fs.existsSync(fullname))
            fs.mkdirSync(fullname)
    }
}

module.exports = {
    getTimeH: getTimeH,
    timeFromNum: timeFromNum,
    buildAlarm: buildAlarm,
    crateIfNotExist: crateIfNotExist
}