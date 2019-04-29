module.exports = {
    get_all_sound_tasks: get_all_sound_tasks,
    go_home: go_home,
    go_to_commit_audio: go_to_commit_audio,
    get_ru_sentences: get_ru_sentences
}

const instances = require('../../instances')
const serv = instances.server
const c = console.log

function get_all_sound_tasks(user) {
    if (user.voice_requests) {
        user.addKeyboard([['⬅️']])
        if (!user.voice_requests.length) {
            delete user.voice_requests
            user.done('Все фразы озвучены')
        } else {
            let prhase = user.voice_requests[0]
            user.done(`Озвучтье\n${prhase.body}`)
        }
    } else
        serv.getVoiceRequests({ key: user.key }, (response) => {
            if (!response.length) {
                user.send('Ну нет же ничего озвучивать!')
                return
            }
            user.voice_requests = []
            let buffer = []//Сюда русские будем сохранять, потом схлопнем
            for (let r of response) {
                if (!(r.dict_unit.answer && r.dict_unit.question))
                    continue
                if (r.dict_unit.question)
                    user.voice_requests.push({
                        id_request: r.id,
                        field: 'question',
                        body: `🇬🇧: ${r.dict_unit.question} 📣\n🇷🇺: ${r.dict_unit.answer}`
                    })
                if (r.dict_unit.answer)
                    buffer.push({
                        id_request: r.id,
                        field: 'answer',
                        body: `🇷🇺: ${r.dict_unit.answer} 📣\n🇬🇧: ${r.dict_unit.question}`
                    })
            }
            user.voice_requests = user.voice_requests.concat(buffer)
            if (!user.voice_requests.length) {
                user.send('Надо сначала произвести [разбор предложений](https://staff.swift-english.com/curator/requests/)')
                return
            }
            let prhase = user.voice_requests[0]
            let keyboard = [['⬅️']]
            if (prhase.field == 'question')
                keyboard.push(['RU'])
            user.addKeyboard(keyboard)
            user.done(`Озвучтье\n${prhase.body}`)
        })
}

function go_home(user, nextStep) {
    user.state = 'main'
    delete user.voice_requests
    nextStep(user)
}

function go_to_commit_audio(user, nextStep) {
    user.voice_requests[0].audio = user.input.body
    user.state = 'to_sound_user_dict_commit'
    nextStep(user)
}

function get_ru_sentences(user, nextStep) {
    let ru_voice_requests = []
    for (let p of user.voice_requests)
        if (p.field == 'answer')
            ru_voice_requests.push(p)
    user.voice_requests = ru_voice_requests
    nextStep(user)
}

