module.exports = {
    get_sound_tasks: get_sound_tasks,
    clear_and_go_to_main: clear_and_go_to_main,
    go_to_commit_audio: go_to_commit_audio
}

const instances = require('../../instances')
const serv = instances.server

function get_sound_tasks(user) {
    if (!user.sound_examples_queue)
        serv.getVoiceRequestsAAM({ key: user.key }, (data) => {
            if (!data.length) {
                user.state = 'main'
                user.done('Все предложения озвучены')
            } else {
                user.sound_examples_queue = data
                user.addKeyboard([['⬅️']])
                user.done(`Озвучьте 📣\n ${user.sound_examples_queue[0].text.replace(/(<([^>]+)>)/ig, '')}`)
            }
        })
    else {
        user.addKeyboard([['⬅️']])
        user.done(`Озвучьте 📣\n${user.sound_examples_queue[0].text.replace(/(<([^>]+)>)/ig, '')}`)
    }
}

function clear_and_go_to_main(user, nextStep) {
    if (user.sound_update_tasks) {
        delete user.sound_update_tasks
        delete user.sound_examples_queue
    }
    user.state = 'main'
    nextStep(user)
}

function go_to_commit_audio(user, nextStep) {
    user.sound_examples_queue[0].audio = user.input.body
    user.state = 'to_sound_examples_commit'
    nextStep(user)
}

