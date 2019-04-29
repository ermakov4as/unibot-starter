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
    user.sound_update_tasks = true
    let queue_id = user.sound_examples_queue[0].queue_id
    let audio = user.sound_examples_queue[0].audio
    serv.putVoiceRequestAAM({ key: user.key, queue_id: queue_id, audio: audio }, (res) => {
        if (res) {
            user.sound_examples_queue.shift()
            if (!user.sound_examples_queue.length) {
                user.state = 'main'
                delete user.sound_update_tasks
                delete user.sound_examples_queue
                user.addMessage('Все предложения озвучены!🙌')
            } else
                user.state = 'to_sound_examples'
            nextStep(user)
        }
    })
}

function no(user, nextStep) {
    user.state = 'to_sound_examples'
    nextStep(user)
}