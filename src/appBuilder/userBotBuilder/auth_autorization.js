module.exports = {
    invite_to_enter_token,
    ckeck_token_in_input
}

const instances = require('../../instances')
const serv = instances.server

function invite_to_enter_token(user) {
    user.addMessage('Введи свой токен (который на странице профиля):')
    user.done()
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
            user.done(`Неверный ключ. Уточните свой токен в [личном профиле](https://app.swift-english.com/profile)`)
        }
    })
}