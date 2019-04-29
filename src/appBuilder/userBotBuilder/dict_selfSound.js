module.exports = {
    getNextSound: getNextSound,
    save_audio: save_audio,
    go_to_dict_main: go_to_dict_main
}

const instances = require('../../instances')
const serv = instances.server
const c = console.log

function getNextSound(user) {
    if (!user.selfSoundArr) {
        user.removeKeyboard()
        user.send('Анализирую словарь...')
        serv.getSelfVoiceArray({ key: user.key }, (res) => {
            user.selfSoundArr = []
            for (let unit of res) {
                if (unit.dict_unit.answer)
                    user.selfSoundArr.push({
                        id: unit.id,
                        field: 'ru',
                        phrase: unit.dict_unit.answer
                    })
                if (unit.dict_unit.question)
                    user.selfSoundArr.push({
                        id: unit.id,
                        field: 'en',
                        phrase: unit.dict_unit.question
                    })
            }
            _getNonOrderedPhrases(user, (array) => {
                user.selfSoundArr = user.selfSoundArr.concat(array)
                if (user.selfSoundArr.length)
                    _getNext(user)
                else{
                    delete user.selfSoundArr
                    user.addMessage('Нет фраз для самоозвучивания')
                    user.state = 'dict_main'
                    user.Fsx()
                }
                    
            })
        })
    } else
        _getNext(user)
}

function _getNext(user) {
    user.addKeyboard([['⬅️']])
    if (user.selfSoundArr[0].field == 'question') {
        user.done('📣🇬🇧 ' + user.selfSoundArr[0].phrase)
    } else {
        user.done('📣🇷🇺 ' + user.selfSoundArr[0].phrase)
    }
}

function _getNonOrderedPhrases(user, callback) {
    serv.getDictByType({ key: user.key, type: 'reversed' }, (arr) => {
        let res = _get_non_sound_from_arr(arr)
        serv.getDictByType({ key: user.key, type: 'sound' }, (arr) => {
            res = res.concat(_get_non_sound_from_arr(arr))
            serv.getDictByType({ key: user.key, type: 'text' }, (arr) => {
                res = res.concat(_get_non_sound_from_arr(arr))
                callback(res)
            })
        })
    })
}
function _get_non_sound_from_arr(arr) {
    let res = []
    for (let o of arr) {
        if (!o.answer_audio && o.answer)
            res.push({
                id: o.id,
                field: 'ru',
                phrase: o.answer
            })
        if (!o.question_audio && o.question)
            res.push({
                id: o.id,
                field: 'en',
                phrase: o.question
            })
    }
    return res
}

function save_audio(user, nextStep) {
    let data = {
        "key": user.key,
        "id": user.selfSoundArr[0].id,
        "field": user.selfSoundArr[0].field,
        "audio": user.input.body
    }
    serv.putSelfVoice(data, (res) => {
        if (res) {
            user.selfSoundArr.shift()
            if (!user.selfSoundArr.length) {
                user.send('Все фразы озвучены✅')
                delete user.selfSoundArr
                user.state = 'dict_main'
            } else {
                user.addMessage('☑️Сохранено')
                user.addMessage('Следующая фраза:')
            }
            nextStep(user)
        }
    })
}

function go_to_dict_main(user, nextStep) {
    user.state = 'dict_main'
    delete user.selfSoundArr
    nextStep(user)
}