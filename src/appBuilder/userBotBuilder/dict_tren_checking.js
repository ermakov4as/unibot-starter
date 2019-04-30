module.exports = {
    can_you_do_it,
    go_to_dict_tren,
    remeber_phrase,
    show_geometric_scheme
}

const instances = require('../../instances')
const serv = instances.server
const c = console.log

function can_you_do_it(user) {
    if (!user.trainDict) {
        user.state = 'main'
        user.Fsx()
        return
    }
    if (user.trainDict.type)
        serv.getDictByType({ key: user.key, type: user.trainDict.type }, (res) => {
            if (res.length)
                _can_you_do_it_output(res.shuffle()[0], user)
            else {
                _all_phrases_done(user)
            }
        })
    else
        serv.getDictRandom({ key: user.key }, (res) => {
            if (res) {
                _can_you_do_it_output(res, user)
            } else
                _all_phrases_done(user)
        })
}

function _can_you_do_it_output(phrase, user) {
    if (phrase.learning_state == 'text') {
        user.addMessage('🇬🇧📖Можешь перевести?')
        user.addMessage(phrase.question);
    }
    if (phrase.learning_state == 'sound') {
        user.addMessage('🇬🇧🎧Понимаешь на слух?')
        user.addAudio(phrase.question_audio);
    }
    if (phrase.learning_state == 'reversed') {
        user.addMessage('🇷🇺📖Можешь построить английское предложение?')
        user.addMessage(phrase.answer);
    }
    user.trainDict.phrase = phrase
    user.addKeyboard([['ℹ', '❌ Нет', '✅ Да'], ['⬅️']])
    user.done()
}

function _all_phrases_done(user) {
    delete user.trainDict
    user.addMessage('Фразы пройдены')
    serv.getDictInfo({ key: user.key }, (res) => {
        if (!(res[0].count + res[1].count + res[2].count)) {
            user.state = 'main'
            user.Fsx()
        } else {
            user.addKeyboard([['⬅️']])
            user.done()
        }
    })
}

function remeber_phrase(doYouKnow) {
    if (doYouKnow)
        return (user, nextStep) => {
            if (!user.trainDict) {
                user.state = 'main'
                user.Fsx()
                return
            }
            let phrase = user.trainDict.phrase
            user.addMessage(`Проверка:\n🇬🇧${phrase.question}\n🇷🇺${phrase.answer}`)
            if (user.addAudio(phrase.question_audio))
                user.addAudio(phrase.question_audio)
            user.state = 'dict_tren_checking_confirm'
            nextStep(user)
        }
    else
        return (user, nextStep) => {
            let phrase = user.trainDict.phrase
            user.addMessage(`🇬🇧${phrase.question}\n🇷🇺${phrase.answer}`)
            if (user.addAudio(phrase.question_audio))
                user.addAudio(phrase.question_audio)
            _main_or_next(user, nextStep)
        }
}

function _main_or_next(user, nextStep) {
    if (user.ntf.fromNotify) {
        user.state = 'main'
        delete user.ntf.fromNotify
    }
    nextStep(user)
}

function go_to_dict_tren(user, nextStep) {
    user.state = 'dict_tren'
    delete user.trainDict
    nextStep(user)
}

function show_geometric_scheme(user, nextStep) {
    let phrase = user.trainDict.phrase
    let req = {
        "id": user.id,
        "key": user.key,
        "id_unit": phrase.id
    }
    serv.getGeometricScheme(req, res => {
        if (res) {
            let img = res.img
            user.addImage(img)
            user.send()
        }
    })
}