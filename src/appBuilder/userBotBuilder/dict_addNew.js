module.exports = {
    choose_field_or_save_with_curators_help: choose_field_or_save_with_curators_help,
    go_to_dict_main: go_to_dict_main,
    recive_field: recive_field,
    saveNewPrhase: saveNewPrhase,
    add_parce: add_parce
}

const instances = require('../../instances')
const serv = instances.server

function choose_field_or_save_with_curators_help(user) {
    if (!user.newPrhase || !(user.newPrhase.ru || user.newPrhase.en)) {
        user.addKeyboard([['🇬🇧', '🇷🇺'], ['⬅️']])
        user.done('Добавьте новое предложение')
    } else {
        let eng = !user.newPrhase.en ? '🇬🇧' : !user.newPrhase.aen ? '📣🇬🇧' : '📣🇬🇧☑️'
        let rus = !user.newPrhase.ru ? '🇷🇺' : !user.newPrhase.aru ? '📣🇷🇺' : '📣🇷🇺☑️'
        let msg = 'Добавляемая фраза:\n'
        if (user.newPrhase.aen)
            msg += '📣'
        if (user.newPrhase.en)
            msg += '🇬🇧 ' + user.newPrhase.en
        if (user.newPrhase.aru)
            msg += '\n📣'
        else if (user.newPrhase.ru)
            msg += '\n'
        if (user.newPrhase.ru)
            msg += '🇷🇺 ' + user.newPrhase.ru
        if (user.newPrhase.toParse)
            msg += '\n+ грамматический разбор 📝'

        let saveBtn = (user.newPrhase.en && user.newPrhase.aen && user.newPrhase.ru && user.newPrhase.aru) ? '✅' : '✅ + 🎓'
        let parceBtn = user.newPrhase.toParse ? '☑️📝' : '📝'
        user.addKeyboard([[eng, rus], ['❌', parceBtn, saveBtn]])
        user.done(msg)
    }
}

function go_to_dict_main(user, nextStep) {
    delete user.newPrhase
    user.state = 'dict_main'
    nextStep(user)
}

function add_parce(user, nextStep) {
    user.newPrhase.toParse = !user.newPrhase.toParse
    nextStep(user)
}

function recive_field(type) {
    return (user, nextStep) => {
        if (!user.newPrhase)
            user.newPrhase = {toParse: false}
        user.newPrhase.type = type
        user.state = 'dict_addNew_getting'
        nextStep(user)
    }
}

function saveNewPrhase(user, nextStep) {
    let data = {
        key: user.key,
        toParse: user.newPrhase.toParse,
        toSound: !(user.newPrhase.en && user.newPrhase.aen && user.newPrhase.ru && user.newPrhase.aru)
    }
    if (user.newPrhase.en)
        data['question'] = user.newPrhase.en
    if (user.newPrhase.aen)
        data['question_audio'] = user.newPrhase.aen
    if (user.newPrhase.ru)
        data['answer'] = user.newPrhase.ru
    if (user.newPrhase.aru)
        data['answer_audio'] = user.newPrhase.aru
    let msg = 'Предложение сохранено ✅'
    if (data.toSound)
        msg += '\n 🎓 Куратор проверит и озвучит'
    if (data.toParse)
        if (data.toSound)
            msg += '\n📝 и произведет грамматический разбор'
        else
            msg += '\n📝 Куратор произведет грамматический разбор'
    console.log(data)
    serv.postDict(data, (response) => {
        if (response) {
            delete user.newPrhase
            user.addMessage(msg)
            nextStep(user)
        }
    })
}