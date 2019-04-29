module.exports = {
    check_last_action_and_send_phrase_from_dict: check_last_action_and_send_phrase_from_dict
}

const c = console.log

function check_last_action_and_send_phrase_from_dict(user, nextStep) {
    let now = new Date()
    let today = now.getDay()
    let hour = ((now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600) + 3) % 24 //+3 потому что по МСК
    now = now.getTime()
    if (!user.ntf || !user.ntf.power || !user.ntf.days[today].power || hour < user.ntf.from || hour > user.ntf.to)
        return
    if (user.ntf.waiting && ((now - user.ntf.lastAction) > user.ntf.period * 60 * 60 * 1000)) {
        user.ntf.waiting = false
        user.ntf.fromNotify = true //Что бы потом из словаря перейти на главную
        user.trainDict = {}
        user.state = 'dict_tren_checking'
        nextStep(user)
    }
}
