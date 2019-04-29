module.exports = {
    give_me_token: give_me_token,
    curator_auth: curator_auth
}

const instances = require('../../instances')
const serv = instances.server

function give_me_token(user) {
    user.done('Укажите токен:')
}

function curator_auth(user, nextStep) {
    user.send('waiting...')
    serv.autorize({ token: user.input.body }, (res) => {
        if (res) {
            serv.getCuratorInfo({ key: res.key }, (response) => {
                if (!response) {
                    user.send('Нет прав куратора')
                    user.apply('command', '/logout')
                    return
                }
                serv.getInfoUser({ key: res.key }, (res2) => {
                    if (res2) {
                        user.key = res.key
                        user.id = res2.id
                        user.name = res2.name
                        user.addMessage(`Привет, ${user.name}!`)
                        user.state = 'main'
                    }
                    nextStep(user)
                })
            })
        } else {
            user.addMessage(`Неверный ключ.`)
            user.send()
        }
    })
}
