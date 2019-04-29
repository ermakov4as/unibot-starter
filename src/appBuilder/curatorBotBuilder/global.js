module.exports = {
    set_last_action: set_last_action,
    delete_user: delete_user,
    start: start
}

function set_last_action(user, nextStep) {
    if (!user.state) {
        user.input.type = 'command'
        user.input.body = '/start'
    }
    if (!user.dialogs)
        user.dialogs = {}
    user.waiting = true
    user.lastAction = new Date().getTime()
    nextStep(user)
}

function delete_user(user) {
    user.addKeyboard([['🚪']])
    user.done(`Пока-пока`)
    user.delete()
}

function start(user, nextStep) {
    if (user.name && user.key) {
        user.addMessage(`Вы зарегистрированы, как ${user.name}.\nКоманда для выхода: /logout`)
        user.state = 'main'
    } else {
        user.state = 'auth'
    }
    nextStep(user)
}