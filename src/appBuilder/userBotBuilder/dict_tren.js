module.exports = {
    get_status_of_my_dict: get_status_of_my_dict,
    go_to_dict_main: go_to_dict_main,
    set_type_and_go_to_dict_tren_checking: set_type_and_go_to_dict_tren_checking
}

const instances = require('../../instances')
const t4 = instances.time4
const serv = instances.server


function get_status_of_my_dict(user) {
    serv.getDictInfo({ key: user.key }, (res) => {
        user.studing = {
            total: res[0].count + res[1].count + res[2].count,
            text: res[0].count,
            sound: res[1].count,
            reversed: res[2].count
        }
        if (user.studing.total) {
            let msg = `Фраз в словаре: *${res[0].count + res[1].count + res[2].count}*\n` +
                `\t\t1. Понимание текста(🇬🇧📖)................${res[0].count}\n` +
                `\t\t2. Восприятие на слух(🇬🇧🎧)..............${res[1].count}\n` +
                `\t\t3. Построение фразы(🇷🇺=>🇬🇧)...........${res[2].count}\n` +
                `Что будем тренировать?`
            keyboardType = []
            keyboardPlayer = []
            if (user.studing.text)
                keyboardType.push('🇬🇧📖')
            if (user.studing.sound) {
                keyboardType.push('🇬🇧🎧')
            }
            if (user.studing.reversed) {
                keyboardType.push('🇷🇺=>🇬🇧')
            }
            let keyboardResult = [keyboardType]
            if (keyboardPlayer.length)
                keyboardResult.push(keyboardPlayer)
            keyboardResult.push(['⬅️', '🎲'])
            user.addKeyboard(keyboardResult)
            user.done(msg)
        } else
            user.send('В словаре нет фраз😕')
    })
}

function go_to_dict_main(user, nextStep) {
    delete user.studing
    if (t4.today() == 3 || t4.today() == 4)
        user.state = 'main'
    else
        user.state = 'dict_main'
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


