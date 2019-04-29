module.exports = {
    show_settings,
    go_to_main,
    switch_power,
    define_attr_and_go_to_set_it
}

const h = require('./../../instances').help

function show_settings(user) {
    keyboard = []
    keyboard[0] = user.ntf.power ? ['🔔'] : ['🔕']
    keyboard[1] = []
    for (let num in user.ntf.days)
        keyboard[1][num] = user.ntf.days[num].power ? user.ntf.days[num].name + '☑️' : user.ntf.days[num].name
    keyboard[2] = [
        `c ${h.timeFromNum(user.ntf.from)}`,
        `до ${h.timeFromNum(user.ntf.to)}`,
        `через ${user.ntf.period < 1 ? user.ntf.period * 60 : user.ntf.period} ${user.ntf.period < 1 ? ' мин' : ' ч'}`
    ]
    keyboard[3] = ['⬅️']
    user.addKeyboard(keyboard)
    user.done('Текущие настройки')
}

function go_to_main(user, nextStep) {
    user.state = 'main'
    nextStep(user)
}

function switch_power(user, nextStep) {
    user.ntf.power = !user.ntf.power
    if (user.ntf.power)
        user.addMessage('Оповещения включены')
    else
        user.addMessage('Оповещения выключены')
    nextStep(user)
}

function define_attr_and_go_to_set_it(user, nextStep) {
    if (user.input.body.indexOf('c ') + 1) {
        user.state = 'dict_ntfSet_setAttr'
        user.ntf.curSet = 'from'
    }
    if (user.input.body.indexOf('до ') + 1) {
        user.state = 'dict_ntfSet_setAttr'
        user.ntf.curSet = 'to'
    }
    if (user.input.body.indexOf('через') + 1) {
        user.state = 'dict_ntfSet_setAttr'
        user.ntf.curSet = 'period'
    }
    let weeks = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
    if (weeks.indexOf(user.input.body.slice(0, 2)) + 1)
        user.ntf.days[weeks.indexOf(user.input.body.slice(0, 2))].power = !user.ntf.days[weeks.indexOf(user.input.body.slice(0, 2))].power
    nextStep(user)
}