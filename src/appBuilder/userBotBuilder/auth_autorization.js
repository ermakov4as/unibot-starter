module.exports = {
    show_msg_and_btn_help: show_msg_and_btn_help,
    go_to_help: go_to_help,
    ckeck_token_in_input: ckeck_token_in_input
}

const instances = require('../../instances')
const serv = instances.server

function show_msg_and_btn_help(user) {
    user.addMessage('Введи свой токен (который на странице профиля):')
    user.addKeyboard([['Помощь']])
    user.done()
}
function go_to_help(user, nextStep) {
    user.state = 'auth_help'
    user.addMessage('Чем могу помочь?')
    nextStep(user)
}
function ckeck_token_in_input(user, nextStep) {
    user.send('Проверяю...')
    serv.autorize({ token: user.input.body }, (res) => {
        if (res) {
            serv.getInfoUser({ key: res.key }, (res2) => {
                if (res2) {
                    user.key = res.key
                    user.id = res2.id
                    user.name = res2.name
                    user.state = 'main'
                    user.addMessage(`Добро пожаловать, ${user.name}!`)
                    nextStep(user)
                }
            })
        } else {
            user.done(`Неверный ключ. Уточните свой токен в [личном профиле](https://staff.swift-english.com/profile)`)
        }
    })
}