module.exports = {
    get_everything_for_sounding: get_everything_for_sounding,
    go_home: go_home,
    get_ru_en_or_comment: get_ru_en_or_comment
}

const instances = require('../../instances')
const serv = instances.server
const c = console.log

function get_everything_for_sounding(user) {
    if (user.parce_phrases) {
        user.addKeyboard([['⬅️']])
        if (!user.parce_phrases.length) {
            delete user.parce_phrases
            user.done('Все фразы разобраны👍')
        } else {
            user.done('Впишите разбор предложения\n' +
                `🇬🇧 ${user.parce_phrases[0].en}\n` +
                `🇷🇺 ${user.parce_phrases[0].ru}`)
        }
    } else
        serv.getAnalysisRequests({ key: user.key }, (response) => {
            if (!response.length) {
                user.addKeyboard([['⬅️']])
                user.done('Нечего разбирать')
                return
            }
            user.parce_phrases = []
            for (let r of response) {
                let newTask = {
                    id: r.id,
                    to_sound: r.dict_unit.voice_state == 'requested'
                }
                if (r.dict_unit.question)
                    newTask.en = r.dict_unit.question
                if (r.dict_unit.answer)
                    newTask.ru = r.dict_unit.answer
                if (r.dict_unit.question_audio)
                    newTask.aen = r.dict_unit.question_audio
                if (r.dict_unit.answer_audio)
                    newTask.aru = r.dict_unit.answer_audio
                user.parce_phrases.push(newTask)
            }
            user.addKeyboard([['⬅️']])
            user.done('Заказ разбор предложения\n' +
                `🇬🇧 ${user.parce_phrases[0].en}\n` +
                `🇷🇺 ${user.parce_phrases[0].ru}`)
        })
}

function go_home(user, nextStep) {
    delete user.parce_phrases
    user.state = 'main'
    nextStep(user)
}

function get_ru_en_or_comment(user, nextStep) {
    let data = {
        key: user.key,
        comment: user.input.body,
        ...user.parce_phrases[0]
    }
    serv.putAnalysisRequests(data, (response) => {
        user.parce_phrases.shift()
        if (!user.parce_phrases.length) {
            delete user.parce_phrases
            user.addMessage('Все фразы разобраны👍')
            user.state = 'main'
        } else
            user.addMessage('Фраза сохранена✅')
        nextStep(user)
    })
}