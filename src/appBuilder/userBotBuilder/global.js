module.exports = {
    set_last_action_and_ckeck_notify_settings: set_last_action_and_ckeck_notify_settings,
    clean_and_say_bye: clean_and_say_bye,
    start: start
}

const c = console.log

function set_last_action_and_ckeck_notify_settings(user, nextStep) {
    if (!user.state) {
        user.input.type = 'command'
        user.input.body = '/start'
    }
    if (!user.messages) {
        user.messages = []
    }
    if (!user.ntf) {
        user.ntf = {
            power: false,
            days: [{
                name: 'ПН',
                power: true
            }, {
                name: 'ВТ',
                power: true
            }, {
                name: 'СР',
                power: true
            }, {
                name: 'ЧТ',
                power: true
            }, {
                name: 'ПТ',
                power: true
            }, {
                name: 'СБ',
                power: false
            }, {
                name: 'ВС',
                power: false
            }],
            from: 7,
            to: 21,
            period: 3
        }
    }
    user.ntf.waiting = true
    user.ntf.lastAction = new Date().getTime()
    nextStep(user)
}


function clean_and_say_bye(user) {
    user.clean()
    if (user.name)
        user.addMessage(`Буду ждать твоего возвращения, ${user.name}!`)
    else
        user.addMessage(`Буду ждать твоего возвращения!`)
    user.addKeyboard([['🚪']])
    user.done()
    user.delete()
}
function start(user, nextStep) {
    if (user.name && user.key) {
        user.addMessage(`Вы зарегистрированы, как ${user.name}.\nКоманда для выхода: /logout`)
        user.state = 'main'
    } else
        user.state = 'auth_autorization'
    nextStep(user)
}

