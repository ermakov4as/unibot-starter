module.exports = {
    get_status_of_my_dict,
    go_to_main,
    set_type_and_go_to_dict_tren_checking
}

const instances = require('../../instances')
const serv = instances.server
const c = console.log

function get_status_of_my_dict(user) {
    serv.getDictInfo({ key: user.key }, (res) => {
        if (!res[0]) {
            user.send('Что-то не так')
            return
        }
        if (!(res[0].count + res[1].count + res[2].count)) {
            user.send('В словаре нет фраз😕')
            return
        }
        if (!user.in_train)
            user.addMessage(
                `Фразы в вашем словаре проходят три стадии изучения:\n` +
                `\t\t1. Понимание текста\n` +
                `\t\t2. Понимание на слух\n` +
                `\t\t3. Перевод с русского\n` +
                `Здесь вы можете потренироваться в переводе фраз из словаря, а они будут соответственно переходить по стадиям. После третьей стадии фразы отправляются в архив изученного, их вы можете увидеть в веб версии словаря или повторить в разделе “Аудирование”.\n` +
                `Чтобы начать тренировку, нажмите на одну из кнопок:\n` +
                `🇬🇧📖    - Тренировать фразы в стадии понимания текста\n` +
                `🇬🇧🎧    - Тренировать фразы в стадии понимания на слух\n` +
                `🇷🇺=>🇬🇧 - Тренировать фразы в стадии перевода с русского`
            )
        user.in_train = true
        let msg = `Фраз в словаре: *${res[0].count + res[1].count + res[2].count}*\n` +
            `\t\t1. Понимание текста(🇬🇧📖)................${res[0].count}\n` +
            `\t\t2. Восприятие на слух(🇬🇧🎧)..............${res[1].count}\n` +
            `\t\t3. Построение фразы(🇷🇺=>🇬🇧)...........${res[2].count}\n` +
            `Что будем тренировать?`
        keyboardType = []
        keyboardPlayer = []
        if (res[0].count)
            keyboardType.push('🇬🇧📖')
        if (res[1].count) {
            keyboardType.push('🇬🇧🎧')
        }
        if (res[2].count) {
            keyboardType.push('🇷🇺=>🇬🇧')
        }
        let keyboardResult = [keyboardType]
        if (keyboardPlayer.length)
            keyboardResult.push(keyboardPlayer)
        keyboardResult.push(['⬅️', '🎲'])
        user.addKeyboard(keyboardResult)
        user.done(msg)
    })
}

function go_to_main(user, nextStep) {
    delete user.in_train
    user.state = 'main'
    nextStep(user)
}

function set_type_and_go_to_dict_tren_checking(type) {
    return (user, nextStep) => {
        user.trainDict = {
            type: type
        }
        user.state = 'dict_tren_checking'
        nextStep(user)
    }
}


