module.exports = {
    are_you_sure: are_you_sure,
    yes: yes,
    no: no
}

const instances = require('../../instances')
const serv = instances.server

function are_you_sure(user) {
    user.addKeyboard([['❌', '✅']])
    user.done('Сохранить?')
}

function yes(user, nextStep) {
    user.voice_requests[0].key = user.key
    serv.putVoiceRequest(user.voice_requests[0], (response) => {
        user.voice_requests.shift()
        if (!user.voice_requests.length) {
            delete user.voice_requests
            user.addMessage('Все фразы пользователей озвучены👍')
            user.state = 'main'
        } else
            user.state = 'to_sound_user_dict'
        nextStep(user)
    })
}

function no(user, nextStep) {
    user.state = 'to_sound_user_dict'
    nextStep(user)
}

