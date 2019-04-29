module.exports = {
    if_there_is_command_make_something: if_there_is_command_make_something
}

const instances = require('../../instances')
const userBot = instances.userBot
const serv = instances.server
const t4 = instances.time4
const c = console.log

let TO_MANY = false
let SENDED_ONCE = false

const PROGRAMMS = {
    regus: {
        func: regus,
        desc: 'Регистрация пользователя, указывая ему заплаченную сумму.',
        example: '$regus newemail@gmail.com pass3f2 1200 [Вячик]'
    },
    help: {
        func: help,
        desc: 'Авторизация пользователя, перевод его состояние диалога, но уже зарегистрированного',
        example: '$help'
    },
    linkinsert: {
        func: () => { },
        desc: 'Прсто пример как вставлять ссылки',
        example: '[якорь](https://app.swift-english.com/dictionary/?auth_token=KEY>)'
    },
    rename: {
        func: rename,
        desc: 'Сменить имя пользователю',
        example: '$rename НовоеИмя'
    },
    rmuser: {
        func: rmuser,
        desc: 'удалить пользователя',
        example: '$rmuser'
    },
    setday: {
        func: setday,
        desc: 'Устанвоить текущий день для отображения пользователю соответствующего функцинала',
        example: '$setday 4'
    },
    nextday: {
        func: nextday,
        desc: 'Открыть функционал следующего дня',
        example: '$nextday'
    },
    main: {
        func: main,
        desc: 'Отправляет пользователя на глвную',
        example: '$main Доступен новый функцинал'
    },
    dialog: {
        func: dialog,
        desc: 'Отправляет пользователя на страницу диалога',
        example: '$dialog Доступен новый функцинал'
    },
    addphrases: {
        func: addphrases,
        desc: 'Добавляет пользователю слова из указанного урока',
        example: '$addphrases 1 – добавляет все фразы из урока 1'
    }
}

function if_there_is_command_make_something(nextStep, TOEVERYONE) {
    return (user) => {
        if (user.input.body[0] == '$') {
            TO_MANY = TOEVERYONE
            SENDED_ONCE = false
            let line = user.input.body.slice(1)
            let argv = line.split(' ')
            let programm = argv[0]
            argv.shift()
            if (!(programm in PROGRAMMS))
                user.send(`-mirror: ${programm}: command not found`)
            else if (TO_MANY)
                userBot.getUsersInfo(['id', 'key'], (users) => {
                    for (let u of users)
                        if (u.key)
                            userBot.getUserById(u.id, client => PROGRAMMS[programm].func(user, client, argv))
                })
            else
                userBot.getUserById(user.currentUser.id, client => PROGRAMMS[programm].func(user, client, argv))
        }
        else
            nextStep(user)
    }
}

////////////////////////////////////////////////////////////
///////////////             PROGRAMMS          /////////////
///////////////////////////////////////////////////////////

function regus(curator, client, argv) {
    if (TO_MANY) {
        if (!SENDED_ONCE) {
            SENDED_ONCE = true
            curator.send(`Запрещенная команда. Перейдите в личный диалог.`)
        }
        return
    }

    let email = argv[0]
    let pass = argv[1]
    let payment = argv[2]
    if (!payment) {
        curator.send(`Нужно указать сколько заплатил пользователь`)
        return
    }
    let name = argv[3] || client.name
    if (!name) {
        curator.send(`Нужно указать имя пользователя`)
        return
    }
    let thread_id = userBot.data.thread_id //t4.get_thread_id() ИЗ ЭКЗЕМПЛЯРА БОТА
    let data = {
        "key": curator.key,
        "email": email,
        "password": pass,
        "thread_id": thread_id,
        "nickname": name,
        "payment": Number(payment)
    }
    serv.registration(data, (res) => {
        if (!res) {
            curator.send(`Ошибка при регистрации пользователя`)
        } else {
            let oldId = client.id
            client.id = res.id
            client.name = res.nickname
            client.key = res.auth
            client.login = email
            client.pass = pass
            client.state = 'dialog'
            client.save()
            //Обновляем данные у кратора о клиенте
            curator.currentUser.name = client.name
            curator.currentUser.id = client.id
            for (let us of curator.groups[curator.curGroup])
                if (us.id == oldId)
                    us = { id: client.id, name: client.name }
            curator.done(`Регистрация пользователя прошла успешно!`)
        }
    })
}

function help(curator, client, argv) {
    let msg = ''
    for (let prog in PROGRAMMS)
        msg += `*${PROGRAMMS[prog].example}* – ${PROGRAMMS[prog].desc}\n\n`
    if (!SENDED_ONCE) {
        SENDED_ONCE = true
        curator.send(msg)
    }
}

function rename(curator, client, argv) {
    if (TO_MANY) {
        if (!SENDED_ONCE) {
            SENDED_ONCE = true
            curator.send(`Запрещенная команда. Перейдите в личный диалог.`)
        }
        return
    }
    if (argv[1]) {
        if (argv[argv.length - 1] == '-g') {
            argv.pop()
            let old = client.globalName ? client.globalName : client.name
            client.globalName = argv.join(' ')
            serv.putRename({ key: curator.key, id: client.id, globalName: client.globalName }, (res) => {
                if (res) {
                    client.save()
                    curator.send(`🎓Было имя пользователя: ${old}\nСменили на: ${client.globalName}\n Обращение: ${client.name}`)
                }
            })
        } else
            curator.send(`🎓для глобального смены имени используй rename <name> -g`)
    } else {
        let old = client.name
        client.name = argv[0]
        client.save()
        curator.send(`🎓Сменили обращение к пользователю с ${old} на ${client.name}`)
    }
}


function rmuser(curator, client, argv) {
    if (TO_MANY) {
        if (!SENDED_ONCE) {
            SENDED_ONCE = true
            curator.send(`Запрещенная команда. Перейдите в личный диалог.`)
        }
        return
    }
    client.delete()
    curator.send(`Ура! Удалили пользователя`)
}

function setday(curator, client, argv) {
    if (!TO_MANY) {
        curator.send(`Команда применима только для всех пользователей. Перейдите в раздел «расслыка».`)
        return
    }
    if (!SENDED_ONCE) {
        SENDED_ONCE = true
        let day = Number(argv[0])
        t4.setday(day)
        curator.send(`Установлен день ${day}`)
    }
}

function nextday(curator, client, argv) {
    if (!TO_MANY) {
        curator.send(`Команда применима только для всех пользователей. Перейдите в раздел «расслыка».`)
        return
    }
    if (!SENDED_ONCE) {
        SENDED_ONCE = true
        let day = t4.nextday()
        curator.send(`Установлен день ${day}`)
    }
}

function main(curator, client, argv) {
    c(client)
    if (client.key) {
        client.state = 'main'
        if (argv.length) {
            let msg = argv.join(' ')
            client.addMessage(msg)
        }
        client.Fsx()
        if (!SENDED_ONCE) {
            SENDED_ONCE = true
            if (TO_MANY)
                curator.send(`Отправили всех зарегистрированных пользователей на главную`)
            else
                curator.send(`Отправили пользователя ${client.name} на главную`)
        }
    }
}

function dialog(curator, client, argv) {
    if (client.key)
        client.state = 'dialog'
    else
        client.state = 'auth_help'
    if (argv.length) {
        let msg = client.insertAttrs(argv.join(' '))
        client.addMessage(msg)
        client.Fsx()
        if (!SENDED_ONCE) {
            SENDED_ONCE = true
            if (TO_MANY)
                curator.send(`Отправили всех пользователей на страницу диалога`)
            else
                curator.send(`Отправили пользователя ${client.name} на страницу диалога`)
        }
    }
}

function addphrases(curator, client, argv) {
    let lesson_num = Number(argv[0])
    if (lesson_num)
        serv.postAddPhrases({ key: client.key, lesson_num: lesson_num }, (res) => {
            if (!SENDED_ONCE && res) {
                SENDED_ONCE = true
                if (TO_MANY)
                    curator.send(`Вроде как збс всем добавили`)
                else
                    curator.send(`Добавили слова из урока ${lesson_num} пользователю ${client.name}`)
            }
        })
}