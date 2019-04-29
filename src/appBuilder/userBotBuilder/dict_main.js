module.exports = {
    perfom_abilyties: perfom_abilyties,
    go_to: go_to
}

const instances = require('../../instances')
const t4 = instances.time4
const serv = instances.server

function perfom_abilyties(user) {
    if (t4.today() < 2) {
        user.state = 'main'
        user.done('Пока не доступо')
        return
    }
    let keyboard = false
    if (t4.today() > 2)
        keyboard = [['Тренировка 🚀'], ['⬅️']]
    if (t4.today() > 4)
        keyboard = [['Тренировка 🚀'], ['Оповещения 🔔'], ['⬅️']]
    if (t4.today() > 5)
        keyboard = [['Тренировка 🚀', 'ААМ 🎧'], ['Оповещения 🔔'], ['⬅️']]
    if (t4.today() > 6)
        keyboard = [['Тренировка 🚀', 'ААМ 🎧'], ['Оповещения 🔔', 'Добавление 🎓'], ['⬅️']]

    if (keyboard)
        user.addKeyboard(keyboard)

    if (!user.outputs.length)
        user.done('Раздел «Личный словарь»')
    else
        user.done()
}

function go_to(state) {
    return (user, nextStep) => {
        user.state = state
        nextStep(user)
    }
}

