module.exports = {
    update: update,
    get_all_tasks_and_update_dialogs: get_all_tasks_and_update_dialogs,
    go_to: go_to
}

const instances = require('../../instances')
const serv = instances.server
const c = console.log

function get_all_tasks_and_update_dialogs(user) {
    _get_required_actions(user, (reqActions) => {
        if (!user.outputs.length)
            user.addMessage('Главная')
        let to_do = []
        if (reqActions.to_check)
            to_do.push(`Практика ${reqActions.to_check}`)
        if (reqActions.to_sound_exam)
            to_do.push(`Озвучка ${reqActions.to_sound_exam}`)
        if (reqActions.to_sound_dict)
            to_do.push(`Словари ${reqActions.to_sound_dict}`)
        let keyboard = [['🔄']]
        if (to_do.length)
            keyboard.push(to_do)
        keyboard.push([`🗞`, user.unreadMsgs ? '💬 🔴' : '💬',])
        user.addKeyboard(keyboard)
        user.done()
    })
}

function update(user, nextStep) {
    user.addMessage('Данные обновлены ✅')
    nextStep(user)
}

function go_to(state) {
    return (user, nextStep) => {
        user.state = state
        nextStep(user)
    }
}

function _get_required_actions(user, callback) {
    serv.getCuratorInfo({ key: user.key }, (response) => {
        let res = {
            to_parse: response.analysis_requests,
            to_sound_dict: response.voice_requests * 2,
            to_check: response.homework_attempts,
            to_sound_exam: 0
        }
        serv.getVoiceRequestsAAM({ key: user.key }, (data) => {
            if (data.length)
                res.to_sound_exam = data.length
            callback(res)
        })
    })
}