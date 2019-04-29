module.exports = {
    getting_value: getting_value,
    go_to_dict_ntfSet: go_to_dict_ntfSet,
    write_value: write_value
}

const h = require('../../instances').help

function getting_value(user) {
    if (user.ntf.curSet == 'from') {
        let keyboard = h.getTimeH(0, user.ntf.to, 12, 3, 'с ')
        keyboard.push(['⬅️'])
        user.addKeyboard(keyboard)
        user.done('С какого времени мне присылать сообщения?')
    }
    if (user.ntf.curSet == 'to') {
        let keyboard = h.getTimeH(user.ntf.from, 24, 12, 3, 'до ')
        keyboard.push(['⬅️'])
        user.addKeyboard(keyboard)
        user.done('До какого времени мне присылать сообщения?')
    }
    if (user.ntf.curSet == 'period') {
        user.addKeyboard([['15 мин', '30 мин', '1 ч', '1.5 ч'], ['2 ч', '3 ч', '5 ч', '8 ч'], ['⬅️']])
        user.done('С какой частотой мне присылать сообщения')
    }
}

function go_to_dict_ntfSet(user, nextStep) {
    user.state = 'dict_ntfSet'
    nextStep(user)
}

function write_value(user, nextStep) {
    if (user.ntf.curSet == 'from') {
        // user.ntf.from = Number(user.input.body.replace('с ', ''))
        let e = user.input.body.replace('с ', '')
        e = e.split(':')
        user.ntf.from = Number(e[0]) + Number(e[1]) / 60
    }
    if (user.ntf.curSet == 'to') {
        let e = user.input.body.replace('до ', '')
        e = e.split(':')
        user.ntf.to = Number(e[0]) + Number(e[1]) / 60
    }
    if (user.ntf.curSet == 'period') {
        let tmp = NaN
        if (user.input.body.indexOf('мин') + 1)
            tmp = Number(user.input.body.replace(' мин', '')) / 60
        if (user.input.body.indexOf('ч') + 1)
            tmp = Number(user.input.body.replace(' ч', ''))
        if (isNaN(tmp)) {
            user.addMessage('Неверный формат')
            nextStep(user)
            return
        } else
            user.ntf.period = tmp
    }
    user.state = 'dict_ntfSet'
    nextStep(user)
}


