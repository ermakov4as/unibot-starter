module.exports = {
    which_state_are_you_gonna_train: which_state_are_you_gonna_train,
    go_to_main: go_to_main,
    generate_audio_file: generate_audio_file,
    generate_aam
}

const instances = require('../../instances')
const serv = instances.server
const c = console.log
let IN_PROCESS = false
let MAIN_PARAM = {
    type: 'будет выбран',
    count: 50,
    order: [{ ru: 6 }, { en: 2 }, { en: 2 }]
}

function which_state_are_you_gonna_train(user) {
    if (IN_PROCESS) {
        user.send('ААМ-файл находится в состоянии генерации. Скоро закончу и пришлю его.')
        return
    }
    serv.getDictInfo({ key: user.key }, (res) => {
        if (!res[0]) {
            user.send('Что-то не так')
            return
        }
        if (!(res[0].count + res[1].count + res[2].count)) {
            user.send('В словаре нет фраз😕')
            return
        }
        let keyboard = []
        let hightLine = []
        if (res[0].count)
            hightLine.push('🇬🇧📖')
        if (res[1].count)
            hightLine.push('🇬🇧🎧')
        if (res[2].count)
            hightLine.push('🇷🇺=>🇬🇧')
        if (hightLine.length)
            keyboard.push(hightLine)
        let lowerLine = ['⬅️']
        if (res[3].count)
            lowerLine.push('✅')
        keyboard.push(lowerLine)
        user.addKeyboard(keyboard)
        user.addMessage(
            `Аудирование - самый эффективный инструмент изучения языка. Фразы в вашем словаре проходят три стадии изучения:\n` +
            `\t\t1. Понимание текста\n` +
            `\t\t2. Понимание на слух\n` +
            `\t\t3. Перевод с русского\n` +
            `Здесь вы можете повторить фразы из определенной стадии на слух. Особенно удобно это делать на ходу. Повторение не займет много времени. Как правило, для повторения всего словаря целиком уходит не больше 10 минут. Выберите стадию, из которой вы хотите прослушать фразы:\n` +
            `🇬🇧📖    - Фразы в стадии понимания текста\n` +
            `🇬🇧🎧    - Фразы в стадии понимания на слух\n` +
            `🇷🇺=>🇬🇧 - Фразы в стадии перевода с русского\n` +
            `В файле друг за другом следуют фразы, каждая звучит в следующим порядке:\n` +
            `Перевод на русский - длинная пауза - перевод на английский - короткая пауза - перевод на английский - короткая пауза. Попытайтесь, услышав вариант на русском, вспомнить перевод и проговорить его, затем проверьте себя и проговорите еще раз после третьего повтора.\n` +
            `Если не вспомнили перевод - ничего страшного, мы все здесь учимся! Главное - слушайте осознанно и проговаривайте каждую фразу.`
        )
        user.done(
            `Фраз в словаре: *${res[0].count + res[1].count + res[2].count + res[3].count}*\n` +
            `\t\t1. Понимание текста(🇬🇧📖)................${res[0].count}\n` +
            `\t\t2. Восприятие на слух(🇬🇧🎧)..............${res[1].count}\n` +
            `\t\t3. Построение фразы(🇷🇺=>🇬🇧)...........${res[2].count}\n` +
            `\t\tИзучено (✅)............................................${res[3].count}\n` +
            `Из какой стадии взять фразы для генерации ААМ-файла?`
        )
    })
}

function generate_audio_file(user, nextStep) {
    if (user.input.body == '🇬🇧📖')
        type = 'text'
    else if (user.input.body == '🇬🇧🎧')
        type = 'sound'
    else if (user.input.body == '🇷🇺=>🇬🇧')
        type = 'reversed'
    else if (user.input.body == '✅')
        type = 'done'
    else {
        nextStep(user)
        return
    }
    MAIN_PARAM.key = user.key
    MAIN_PARAM.type = type

    IN_PROCESS = true
    user.state = 'main'
    user.addMessage('Начал генерировать ААМ–файл. Как закончю, пришлю сообщение👌')
    nextStep(user)
    serv.getGenerateAAM(MAIN_PARAM, file => {
        IN_PROCESS = false
        if (file) {
            user.state = 'main'
            user.done('ААМ–файл для аудио-тренировки готов!')
            user.sendAudio(file)
        } else {
            console.log('Файл почему-то не сгенерирован. Response:')
            console.log(file)
        }
    })
}

function go_to_main(user, nextStep) {
    delete user.studing
    user.state = 'main'
    nextStep(user)
}

function generate_aam(user, nextStep) {
    if (IN_PROCESS) {
        user.send('ААМ-файл находится в состоянии генерации. Скоро закончу и пришлю его.')
        return
    } else {
        let req = {
            key: user.key,
            type: 'reversed',
            count: 50,
            order: [{ ru: 6 }, { en: 2 }, { en: 2 }]
        }

        IN_PROCESS = true
        user.state = 'main'
        user.addMessage('Начал генерировать ААМ–файл. Как закончю, пришлю сообщение👌')
        nextStep(user)
        serv.getGenerateAAM(req, file => {
            IN_PROCESS = false
            if (file) {
                user.state = 'main'
                user.done('ААМ–файл для аудио-тренировки готов!')
                user.sendAudio(file)
            } else {
                console.log('Файл почему-то не сгенерирован. Response:')
                console.log(file)
            }
        })
    }
}



// en –> ru легкий: 	en – 4 – en – 5 – ru – 2. 		(50 предложений) 	≈17c x 50 ≈ 14 мин.
// en –> ru средний: 	en – 2 – en – 4 – ru – 1 – en – 2. 	(50 предложений) 	≈16с х 50 ≈13 мин.
// en –> ru хард: 	en – 3 – ru – 2 			(100 предложений) 	≈9с х 100 ≈15 мин.
// ru –> en легкий:	ru – 8 – en – 1 – en – 1. 		(50 предложений) 	≈16с х 50 ≈13 мин.
// ru –> en средний: 	ru – 6 – en – 1 – en – 1. 		(50 предложений) 	≈14с х 50 ≈12 мин.
// ru –> en хард:		ru – 4 – en – 1 – en – 1. 		(50 предложений) 	≈12с х 50 ≈10 мин.


// const AAM_PARAMS = {
//     en: {
//         easy: {
//             order: [{ en: 4 }, { en: 5 }, { ru: 2 }],
//             count: 50
//         },
//         medium: {
//             order: [{ en: 2 }, { en: 4 }, { ru: 1 }, { en: 2 }],
//             count: 50
//         },
//         hard: {
//             order: [{ en: 3 }, { ru: 2 }],
//             count: 100
//         }
//     },
//     ru: {
//         easy: {
//             order: [{ ru: 8 }, { en: 1 }, { en: 1 }],
//             count: 50
//         },
//         medium: {
//             order: [{ ru: 6 }, { en: 1 }, { en: 1 }],
//             count: 50
//         },
//         hard: {
//             order: [{ ru: 4 }, { en: 1 }, { en: 1 }],
//             count: 50
//         }
//     },
//     done: {
//         easy: {
//             order: [{ en: 3 }, { en: 2 }],
//             count: 200
//         },
//         medium: {
//             order: [{ en: 2 }],
//             count: 300
//         },
//         hard: {
//             order: [{ en: 0 }],
//             count: 500
//         }
//     }
// }

// function get_aam_status(user) {
//     if (IN_PROCESS) {
//         user.send('ААМ-файл находится в состоянии генерации. Скоро закончу и пришлю его.')
//         return
//     }
//     serv.getDictInfo({ key: user.key }, (res) => {
//         let amm = {
//             en: Math.min(res[1].question_audio_count, res[1].answer_audio_count),
//             ru: Math.min(res[2].question_audio_count, res[2].answer_audio_count),
//             done: res[3].question_audio_count
//         }
//         if (amm.en + amm.ru + amm.done) {
//             let msg = `Доступные ААМ-типы:\n` +
//                 `🇬🇧 => 🇷🇺................${amm.en}\n` +
//                 `🇷🇺 => 🇬🇧................${amm.ru}\n` +
//                 `✅............................${amm.done}\n\n` +
//                 `Уровни сложности:\n` +
//                 `⚪️ – легкий\n` +
//                 `🔵 – средний\n` +
//                 `🔴 – тяжелый\n`
//             let keyboard = []
//             if (amm.en)
//                 keyboard.push(['🇬🇧=>🇷🇺 ⚪️', '🇬🇧=>🇷🇺 🔵', '🇬🇧=>🇷🇺 🔴'])
//             if (amm.ru)
//                 keyboard.push(['🇷🇺=>🇬🇧 ⚪️', '🇷🇺=>🇬🇧 🔵', '🇷🇺=>🇬🇧 🔴'])
//             if (amm.done)
//                 keyboard.push(['✅ ⚪️', '✅ 🔵', '✅ 🔴'])
//             keyboard.push(['⬅️'])
//             user.addKeyboard(keyboard)
//             user.done(msg)
//         } else
//             user.send('Для генерации ААМ-файлов, в словаре должны фразы на стадии 🇬🇧🎧 или выше.')
//     })
// }

// function generate_audio_file(user, nextStep) {
//     let params = user.input.body.split(' ')
//     let type = level = false
//     if (params[0] == '🇬🇧=>🇷🇺')
//         type = 'en'
//     else if (params[0] == '🇷🇺=>🇬🇧')
//         type = 'ru'
//     else if (params[0] == '✅')
//         type = 'done'
//     else {
//         nextStep(user)
//         return
//     }


//     if (params[1] == '⚪️')
//         level = 'easy'
//     else if (params[1] == '🔵')
//         level = 'medium'
//     else if (params[1] == '🔴')
//         level = 'hard'
//     let req = {
//         key: user.key,
//         type: type,
//         count: AAM_PARAMS[type][level].count,
//         order: AAM_PARAMS[type][level].order
//     }
//     IN_PROCESS = true
//     user.state = 'main'
//     user.addMessage('Начал генерировать ААМ–файл. Как закончю, пришлю сообщение👌')
//     nextStep(user)
//     serv.getGenerateAAM(req, file => {
//         IN_PROCESS = false
//         if (file) {
//             user.state = 'main'
//             user.done('ААМ–файл для аудио-тренировки готов!')
//             user.sendAudio(file)
//         } else {
//             console.log('Файл почему-то не сгенерирован. Response:')
//             console.log(file)
//         }
//     })
// }