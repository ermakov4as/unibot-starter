module.exports = {
    show_practice_dict_and_dialog,
    go_to_practice_lessons,
    go_to_dialog,
    go_to_help,
    go_to_dict_tren
}

const t4 = require('../../instances').time4
const help_msg = 'Это справка. Читайте. Читайте внимательно. Но если всё равно непонятно - пишите прямо здесь.'

function show_practice_dict_and_dialog(user) {
    if (!user.outputs.length)
        user.addMessage(`Главная`)
    let dialogBtn = user.newMsg ? 'Справка ℹ 💬 🔴' : 'Справка ℹ 💬'

    let keyboardTop_layer_1 = ['Оповещения 🔔', 'Тренажёр 🚀']
    let keyboardTop_layer_2 = ['Аудирование 🎧', dialogBtn]
    user.addKeyboard([keyboardTop_layer_1, keyboardTop_layer_2])
    user.done()
}

function go_to_practice_lessons(user, nextStep) {
    user.state = 'practice_lessons'
    nextStep(user)
}

function go_to_dialog(user, nextStep) {
    user.newMsg = false
    user.state = 'dialog'
    nextStep(user)
}

function go_to_help(user, nextStep) {
    if (!user.newMsg) user.addMessage(help_msg)
    user.newMsg = false
    user.state = 'dialog'
    nextStep(user)
}

function go_to_dict_tren(user, nextStep) {
    user.state = 'dict_tren'
    nextStep(user)
}